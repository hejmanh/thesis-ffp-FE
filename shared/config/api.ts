export const API_CONFIG = {
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1",
};

export const TIMEOUT = 15_000;

export interface ApiErrorDetail {
  path?: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: ApiErrorDetail[];
}
