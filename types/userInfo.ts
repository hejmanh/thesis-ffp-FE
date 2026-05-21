export type AllocationType = "PRE_FFP" | "POST_FFP";

export interface UserInfoFinancialProfile {
  desiredLifeExpectancy: number;
  currentSavings: number;
  currencyCode: string;
}

export interface UserInfoFinancialProfileResponse extends UserInfoFinancialProfile {
  estimatedLifeExpectancy: number;
}

export interface UserInfoPortfolioAllocation {
  allocationType: AllocationType;
  u: number;
  mu: number;
  rf: number;
}

export interface UserInfoLifestyleProfile {
  smokingCode: string;
  physicalActivityCode: string;
  dietQualityCode: string;
  alcoholConsumptionCode: string;
}

export interface UserInfoStageData {
  lifeStageRangeId: number;
  initialAnnualSavings: number;
  growthRate: number;
}

export interface UserInfoAssetData {
  assetTypeId: number;
  initialAnnualIncome: number;
  growthRate: number;
}

export interface UserInfoAssetResponse {
  uid: string;
  assetId: number;
  assetTypeCode: string | null;
  assetTypeTitle: string | null;
  initialAnnualIncome: number;
  growthRate: number;
}

export interface UserInfoResponse {
  financialProfile?: UserInfoFinancialProfileResponse | null;
  portfolioAllocations?: UserInfoPortfolioAllocation[] | null;
  lifestyleProfile?: UserInfoLifestyleProfile | null;
  stageData?: UserInfoStageData[] | null;
  assetData?: UserInfoAssetResponse[] | null;
}

export interface GetUserInfoResponse {
  userInfo?: UserInfoResponse | null;
}

export interface CreateUserInfoRequest {
  userInfo: {
    financialProfile: UserInfoFinancialProfile;
    portfolioAllocations: UserInfoPortfolioAllocation[];
    lifestyleProfile: UserInfoLifestyleProfile;
    stageData: UserInfoStageData[];
    assetData: UserInfoAssetData[];
  };
}

export type CreateUserInfoResponse = null;

export type PatchBasicRequest = UserInfoFinancialProfile;

export type PatchPortfolioRequest = UserInfoPortfolioAllocation[];
export type CreatePortfolioRequest = UserInfoPortfolioAllocation[];

export type PatchLifestyleRequest = UserInfoLifestyleProfile;
export type CreateLifestyleRequest = UserInfoLifestyleProfile;

export interface PatchLifestyleResponse {
  lifestyleProfile: UserInfoLifestyleProfile;
  estimatedLifeExpectancy: number;
}

export type PatchStagesRequest = UserInfoStageData[];
export type CreateStagesRequest = UserInfoStageData[];

export interface PatchAssetsRequestItem {
  uid: string;
  initialAnnualIncome: number;
  growthRate: number;
}

export type PatchAssetsRequest = PatchAssetsRequestItem[];

export interface CreateAssetsRequest {
  assetData: UserInfoAssetData[];
}

export type CreateAssetsResponse = Array<{
  uid: string;
  initialAnnualIncome: number;
  growthRate: number;
}>;
