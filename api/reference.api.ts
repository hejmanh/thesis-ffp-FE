import { api } from "@/lib/apiRequest";
import type { ApiResponse } from "@/shared/config/api";
import type { Country, SexType } from "@/types/reference";
import { API_ENDPOINTS } from "@/api/endpoints";

export const referenceApi = {
  getCountries: (): Promise<ApiResponse<Country[]>> =>
    api.get(API_ENDPOINTS.reference.countries),
  getSexTypes: (): Promise<ApiResponse<SexType[]>> =>
    api.get(API_ENDPOINTS.reference.sexTypes),
};
