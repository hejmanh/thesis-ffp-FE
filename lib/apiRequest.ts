import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { API_CONFIG, TIMEOUT, type ApiResponse } from "@/shared/config/api";
import { tokenService } from "@/services/token.service";
import { csrfService } from "@/services/csrf.service";
import { tokenRefreshManager } from "@/lib/tokenRefreshManager";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  defaultLocale,
  getLocaleFromPathname,
  isLocale,
  localeCookieName,
} from "@/i18n/routing";

const SKIP_REFRESH_URLS = [
  API_ENDPOINTS.auth.refresh,
  API_ENDPOINTS.auth.login,
  API_ENDPOINTS.auth.register,
  API_ENDPOINTS.auth.verifyEmail,
  API_ENDPOINTS.auth.forgotPassword,
  API_ENDPOINTS.auth.resetPassword,
];

type RetryConfig = AxiosRequestConfig & { _retry?: boolean };
type ApiEnvelope<T> = ApiResponse<T> & { data?: T };

function getActiveLocale(): string {
  if (typeof window === "undefined") {
    return defaultLocale;
  }

  const pathnameLocale = getLocaleFromPathname(window.location.pathname);
  if (pathnameLocale) {
    return pathnameLocale;
  }

  const cookieLocale = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${localeCookieName}=`))
    ?.split("=")[1];

  return isLocale(cookieLocale) ? cookieLocale : defaultLocale;
}

function formatApiErrorMessage<T>(
  data: Partial<ApiEnvelope<T>>,
  fallback: string,
) {
  const validationMessages = data.errors
    ?.map((entry) => entry.message.trim())
    .filter((message) => message.length > 0);

  if (validationMessages && validationMessages.length > 0) {
    return validationMessages.join("; ");
  }

  return data.message ?? fallback;
}

class ApiRequest {
  private readonly instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: TIMEOUT,
    withCredentials: true,
  });

  constructor() {
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use((config) => {
      const headers = config.headers ?? {};
      const token = tokenService.get();

      // attach or replace access token
      if (token) {
        (headers as Record<string, string>).Authorization = `Bearer ${token}`;
      }

      // attach or replace CSRF token
      const csrf = csrfService.get();
      if (csrf) {
        (headers as Record<string, string>)["x-csrf-token"] = csrf;
      }

      // set JSON content type for non-FormData requests
      // FormData requests are handled automatically by the browser/runtime
      const isFormData =
        typeof FormData !== "undefined" && config.data instanceof FormData;
      if (!isFormData) {
        const headerBag = headers as Record<string, string>;
        if (!headerBag["Content-Type"] && !headerBag["content-type"]) {
          headerBag["Content-Type"] = "application/json";
        }
      }

      (headers as Record<string, string>)["Accept-Language"] = getActiveLocale();

      config.headers = headers;
      return config;
    });

    this.instance.interceptors.response.use(
      (res) => res, // pass through successful responses
      async (error) => {
        // refresh access token on 401 response
        const original = error.config as RetryConfig | undefined;

        // ignore non-401 errors or missing request config
        if (!original || error.response?.status !== 401) {
          return Promise.reject(error);
        }

        // skip refresh for auth endpoints or already retried requests
        const isAuthUrl = SKIP_REFRESH_URLS.some((url) =>
          original.url?.includes(url),
        );
        // only clear token if refresh endpoint returns 401 (token definitively invalid)
        const isRefreshUrl = original.url?.includes(API_ENDPOINTS.auth.refresh);
        if (isAuthUrl || original._retry) {
          if (isRefreshUrl) {
            tokenService.clear();
          }
          return Promise.reject(error);
        }

        // prevent infinite retry loops
        original._retry = true;

        try {
          // refresh access token
          const newToken = await tokenRefreshManager.getValidToken(async () => {
            const { authApi } = await import("@/api/auth.api");

            const res = await authApi.refresh();

            if (!res.success || !res.data?.accessToken) {
              throw new Error("Refresh failed");
            }

            tokenService.set(res.data.accessToken);

            return res.data.accessToken;
          });

          // retry original request with new token
          const headerBag = (original.headers ?? {}) as Record<string, string>;
          headerBag.Authorization = `Bearer ${newToken}`;
          original.headers = headerBag;

          return this.instance(original);
        } catch (refreshError) {
          tokenService.clear();
          if (typeof window !== "undefined") {
             const isAlreadyOnLoginPage = window.location.pathname === "/" && new URLSearchParams(window.location.search).get("login") === "1";
             if (!isAlreadyOnLoginPage) {
               window.location.href = `/${getActiveLocale()}?login=1`;
             }
           }
          return Promise.reject(refreshError);
        }
      },
    );
  }

  async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const res = await this.instance.get(endpoint, config);
      return this.normalise<T>(res);
    } catch (err) {
      return this.handleError(err);
    }
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const res = await this.instance.post(endpoint, data, config);
      return this.normalise<T>(res);
    } catch (err) {
      return this.handleError(err);
    }
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const res = await this.instance.put(endpoint, data, config);
      return this.normalise<T>(res);
    } catch (err) {
      return this.handleError(err);
    }
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const res = await this.instance.patch(endpoint, data, config);
      if (res.status === 204) return { success: true, data: undefined as T };
      return this.normalise<T>(res);
    } catch (err) {
      return this.handleError(err);
    }
  }

  async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const res = await this.instance.delete(endpoint, config);
      if (res.status === 204 || res.data == null) {
        return { success: true, data: undefined as T };
      }
      return this.normalise<T>(res);
    } catch (err) {
      return this.handleError(err);
    }
  }

  private normalise<T>(res: AxiosResponse<ApiEnvelope<T>>): ApiResponse<T> {
    const data = res.data ?? {};
    const ok = data.success === true || (res.status >= 200 && res.status < 300);
    const message = ok
      ? data.message
      : formatApiErrorMessage(data, data.message ?? "Request failed");

    return {
      success: ok,
      data: data.data as T,
      message,
      error: ok ? undefined : message,
      errors: data.errors,
      meta: data.meta,
    };
  }

  private handleError<T>(err: unknown): ApiResponse<T> {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<ApiEnvelope<T>>;
      const data: Partial<ApiEnvelope<T>> = axiosError.response?.data ?? {};
      const message = formatApiErrorMessage(
        data,
        axiosError.message ?? "Request failed",
      );
      return {
        success: false,
        data: data.data as T,
        message,
        error: message,
        errors: data.errors,
        meta: data.meta,
      };
    }

    const message = err instanceof Error ? err.message : "Request failed";
    return {
      success: false,
      message,
      error: message,
    };
  }
}

export const api = new ApiRequest();
