export const API_CONFIG = {
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1",
};

export const TIMEOUT = 15_000;

export interface ApiErrorDetail {
  path?: string;
  code?: string;
  message: string;
}

export interface ApiMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  code?: string;
  message?: string;
  error?: string;
  errors?: ApiErrorDetail[];
  meta?: ApiMeta;
}
