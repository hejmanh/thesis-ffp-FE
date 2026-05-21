import { api } from "@/lib/apiRequest";
import type { ApiResponse } from "@/shared/config/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  CreateAssetsRequest,
  CreateAssetsResponse,
  CreateLifestyleRequest,
  CreatePortfolioRequest,
  CreateStagesRequest,
  CreateUserInfoRequest,
  CreateUserInfoResponse,
  GetUserInfoResponse,
  PatchAssetsRequest,
  PatchBasicRequest,
  PatchLifestyleRequest,
  PatchLifestyleResponse,
  PatchPortfolioRequest,
  PatchStagesRequest,
} from "@/types/userInfo";

export const userInfoApi = {
  createUserInfo: (
    payload: CreateUserInfoRequest,
  ): Promise<ApiResponse<CreateUserInfoResponse>> =>
    api.post(API_ENDPOINTS.userInfo.profile, payload),

  getUserInfo: (): Promise<ApiResponse<GetUserInfoResponse>> =>
    api.get(API_ENDPOINTS.userInfo.profile),

  patchBasic: (payload: PatchBasicRequest): Promise<ApiResponse<null>> =>
    api.patch(API_ENDPOINTS.userInfo.basic, payload),

  patchPortfolio: (payload: PatchPortfolioRequest): Promise<ApiResponse<null>> =>
    api.patch(API_ENDPOINTS.userInfo.portfolio, payload),

  createPortfolio: (
    payload: CreatePortfolioRequest,
  ): Promise<ApiResponse<null>> => api.post(API_ENDPOINTS.userInfo.portfolio, payload),

  patchLifestyle: (
    payload: PatchLifestyleRequest,
  ): Promise<ApiResponse<PatchLifestyleResponse>> =>
    api.patch(API_ENDPOINTS.userInfo.lifestyle, payload),

  createLifestyle: (
    payload: CreateLifestyleRequest,
  ): Promise<ApiResponse<PatchLifestyleResponse | null>> =>
    api.post(API_ENDPOINTS.userInfo.lifestyle, payload),

  patchStages: (payload: PatchStagesRequest): Promise<ApiResponse<null>> =>
    api.patch(API_ENDPOINTS.userInfo.stages, payload),

  createStages: (payload: CreateStagesRequest): Promise<ApiResponse<null>> =>
    api.post(API_ENDPOINTS.userInfo.stages, payload),

  createAssets: (
    payload: CreateAssetsRequest,
  ): Promise<ApiResponse<CreateAssetsResponse>> =>
    api.post(API_ENDPOINTS.userInfo.assets, payload),

  patchAssets: (payload: PatchAssetsRequest): Promise<ApiResponse<null>> =>
    api.patch(API_ENDPOINTS.userInfo.assets, payload),

  deleteAsset: (uid: string): Promise<ApiResponse<null>> =>
    api.delete(API_ENDPOINTS.userInfo.assetByUid(uid)),
};
