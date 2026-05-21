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
  PatchStagesRequest,
} from "@/types/userInfo";

export const userInfoApi = {
  getFinancial: (): Promise<ApiResponse<GetFinancialResponse>> =>
    api.get(API_ENDPOINTS.userInfo.financial),

  createFinancial: (
    payload: CreateFinancialRequest,
  ): Promise<ApiResponse<CreateFinancialResponse>> =>
    api.post(API_ENDPOINTS.userInfo.financial, payload),

  patchFinancial: (
    payload: PatchFinancialRequest,
  ): Promise<ApiResponse<PatchFinancialResponse>> =>
    api.patch(API_ENDPOINTS.userInfo.financial, payload),

  getStages: (): Promise<ApiResponse<GetStagesResponse | CreateStagesRequest>> =>
    api.get(API_ENDPOINTS.userInfo.stages),

  patchStages: (payload: PatchStagesRequest): Promise<ApiResponse<null>> =>
    api.patch(API_ENDPOINTS.userInfo.stages, payload),

  createStages: (payload: CreateStagesRequest): Promise<ApiResponse<null>> =>
    api.post(API_ENDPOINTS.userInfo.stages, payload),

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
