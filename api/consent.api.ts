import { api } from "@/lib/apiRequest";
import type { ApiResponse } from "@/shared/config/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { ConsentPayload, ConsentResult, ConsentStatus } from "@/types/consent";

export const consentApi = {
  getStatus: (): Promise<ApiResponse<ConsentStatus>> =>
    api.get(API_ENDPOINTS.consent.me),

  record: (payload: ConsentPayload): Promise<ApiResponse<ConsentResult>> =>
    api.post(API_ENDPOINTS.consent.record, payload),
};
