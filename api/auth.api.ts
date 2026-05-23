import { api } from "@/lib/apiRequest";
import type { ApiResponse } from "@/shared/config/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { csrfService } from "@/services/csrf.service";
import type {
  EmptyResponseData,
  LoginResponseData,
  LoginPayload,
  RefreshResponseData,
  RegisterInput,
  ResetPasswordPayload,
} from "@/types/auth";

export const authApi = {
  register: (payload: RegisterInput): Promise<ApiResponse<EmptyResponseData>> =>
    api.post(API_ENDPOINTS.auth.register, payload),

  verifyEmail: (token: string): Promise<ApiResponse<EmptyResponseData>> =>
    api.get(API_ENDPOINTS.auth.verifyEmail, {
      params: { token },
      timeout: 30_000,
    }),

  login: (payload: LoginPayload): Promise<ApiResponse<LoginResponseData>> =>
    api.post(API_ENDPOINTS.auth.login, payload),

  logout: (): Promise<ApiResponse<EmptyResponseData>> => {
    const csrfToken = csrfService.get();

    return api.post(API_ENDPOINTS.auth.logout, undefined, {
      headers: csrfToken ? { "X-CSRF-Token": csrfToken } : undefined,
    });
  },

  refresh: (): Promise<ApiResponse<RefreshResponseData>> => {
    const csrfToken = csrfService.get();

    return api.post(API_ENDPOINTS.auth.refresh, undefined, {
      headers: csrfToken ? { "X-CSRF-Token": csrfToken } : undefined,
    });
  },

  forgotPassword: (email: string): Promise<ApiResponse<EmptyResponseData>> =>
    api.post(API_ENDPOINTS.auth.forgotPassword, { email }),

  resetPassword: (
    payload: ResetPasswordPayload,
  ): Promise<ApiResponse<EmptyResponseData>> =>
    api.post(API_ENDPOINTS.auth.resetPassword, payload, { timeout: 30_000 }),
};
