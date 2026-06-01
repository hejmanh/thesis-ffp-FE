import { api } from "@/lib/apiRequest";
import type { ApiResponse } from "@/shared/config/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  CreateAssetsRequest,
  CreateAssetsResponse,
  CreateFinancialRequest,
  CreateFinancialResponse,
  CreateStagesRequest,
  GetAssetsResponse,
  GetFinancialResponse,
  GetStagesResponse,
  PatchAssetsRequest,
  PatchFinancialRequest,
  PatchFinancialResponse,
  PatchUserInfoMeRequest,
  PatchStagesRequest,
} from "@/types/userInfo";
import type { UserContextData } from "@/types/userContext";

function buildFinancialPayload(
  payload: CreateFinancialRequest,
): PatchFinancialRequest {
  return {
    financial: payload,
  };
}

export const userInfoApi = {
  getMe: (): Promise<ApiResponse<UserContextData>> =>
    api.get(API_ENDPOINTS.userInfo.me),

  patchMe: (
    payload: PatchUserInfoMeRequest,
  ): Promise<ApiResponse<UserContextData>> =>
    api.patch(API_ENDPOINTS.userInfo.me, payload),

  getFinancial: (): Promise<ApiResponse<GetFinancialResponse>> =>
    api.get(API_ENDPOINTS.userInfo.financial),

  createFinancial: (
    payload: CreateFinancialRequest,
  ): Promise<ApiResponse<CreateFinancialResponse>> =>
    api.post(API_ENDPOINTS.userInfo.financial, buildFinancialPayload(payload)),

  patchFinancial: (
    payload: CreateFinancialRequest,
  ): Promise<ApiResponse<PatchFinancialResponse>> =>
    api.patch(API_ENDPOINTS.userInfo.financial, buildFinancialPayload(payload)),

  getStages: (): Promise<
    ApiResponse<GetStagesResponse | CreateStagesRequest>
  > => api.get(API_ENDPOINTS.userInfo.lifeStages),

  patchStages: (payload: PatchStagesRequest): Promise<ApiResponse<null>> =>
    api.patch(API_ENDPOINTS.userInfo.lifeStages, payload),

  createStages: (payload: CreateStagesRequest): Promise<ApiResponse<null>> =>
    api.post(API_ENDPOINTS.userInfo.lifeStages, payload),

  getAssets: (): Promise<ApiResponse<GetAssetsResponse>> =>
    api.get(API_ENDPOINTS.userInfo.assets),

  createAssets: (
    payload: CreateAssetsRequest,
  ): Promise<ApiResponse<CreateAssetsResponse>> =>
    api.post(API_ENDPOINTS.userInfo.assets, payload),

  patchAssets: (payload: PatchAssetsRequest): Promise<ApiResponse<null>> =>
    api.patch(API_ENDPOINTS.userInfo.assets, payload),

  deleteAsset: (uid: string): Promise<ApiResponse<null>> =>
    api.delete(API_ENDPOINTS.userInfo.assetByUid(uid)),
};
