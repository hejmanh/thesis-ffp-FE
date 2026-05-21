import { userInfoApi } from "@/api/userInfo.api";
import type {
  CreateAssetsRequest,
  CreateAssetsResponse,
  CreateUserInfoRequest,
  GetUserInfoResponse,
  PatchAssetsRequest,
  PatchBasicRequest,
  PatchLifestyleRequest,
  PatchLifestyleResponse,
  PatchPortfolioRequest,
  PatchStagesRequest,
} from "@/types/userInfo";

export const userInfoService = {
  async createUserInfo(payload: CreateUserInfoRequest): Promise<void> {
    const res = await userInfoApi.createUserInfo(payload);
    if (!res.success) {
      throw new Error(res.error ?? "Unable to create user profile");
    }
  },

  async getUserInfo(): Promise<GetUserInfoResponse> {
    const res = await userInfoApi.getUserInfo();
    if (!res.success || !res.data?.userInfo) {
      throw new Error(res.error ?? "Unable to load user profile");
    }
    return res.data;
  },

  async patchBasic(payload: PatchBasicRequest): Promise<void> {
    const res = await userInfoApi.patchBasic(payload);
    if (!res.success) {
      throw new Error(res.error ?? "Unable to update financial profile");
    }
  },

  async patchPortfolio(payload: PatchPortfolioRequest): Promise<void> {
    const res = await userInfoApi.patchPortfolio(payload);
    if (!res.success) {
      throw new Error(res.error ?? "Unable to update asset allocation");
    }
  },

  async patchLifestyle(
    payload: PatchLifestyleRequest,
  ): Promise<PatchLifestyleResponse> {
    const res = await userInfoApi.patchLifestyle(payload);
    if (!res.success || !res.data) {
      throw new Error(res.error ?? "Unable to update lifestyle profile");
    }
    return res.data;
  },

  async patchStages(payload: PatchStagesRequest): Promise<void> {
    const res = await userInfoApi.patchStages(payload);
    if (!res.success) {
      throw new Error(res.error ?? "Unable to update stages");
    }
  },

  async createAssets(payload: CreateAssetsRequest): Promise<CreateAssetsResponse> {
    const res = await userInfoApi.createAssets(payload);
    if (!res.success || !res.data) {
      throw new Error(res.error ?? "Unable to create assets");
    }
    return res.data;
  },

  async patchAssets(payload: PatchAssetsRequest): Promise<void> {
    const res = await userInfoApi.patchAssets(payload);
    if (!res.success) {
      throw new Error(res.error ?? "Unable to update assets");
    }
  },

  async deleteAsset(uid: string): Promise<void> {
    const res = await userInfoApi.deleteAsset(uid);
    if (!res.success) {
      throw new Error(res.error ?? "Unable to delete asset");
    }
  },
};
