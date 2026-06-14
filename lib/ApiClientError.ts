import type { ApiErrorDetail, ApiResponse } from "@/shared/config/api";

export class ApiClientError extends Error {
  code: string;
  details?: ApiErrorDetail[];

  constructor(code: string, message: string, details?: ApiErrorDetail[]) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.details = details;
  }
}

export function toApiClientError(
  response: Pick<ApiResponse, "code" | "error" | "message" | "errors">,
  fallbackMessage: string,
): ApiClientError {
  return new ApiClientError(
    response.code ?? "SYSTEM.UNKNOWN",
    response.error ?? response.message ?? fallbackMessage,
    response.errors,
  );
}

export function throwApiClientError(
  response: Pick<ApiResponse, "code" | "error" | "message" | "errors">,
  fallbackMessage: string,
): never {
  throw toApiClientError(response, fallbackMessage);
}
