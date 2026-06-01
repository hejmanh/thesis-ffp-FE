export type AllocationType = "PRE_FFP" | "POST_FFP";

export interface UserInfoFinancialProfile {
  desiredLifeExpectancy: number;
  currentSavings: number;
  currencyId: number;
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
  smokingTypeId: number;
  physicalActivityTypeId: number;
  dietQualityTypeId: number;
  alcoholConsumptionTypeId: number;
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

export interface UserInfoFinancialResource {
  financialProfile?: UserInfoFinancialProfileResponse | null;
  portfolioAllocations?: UserInfoPortfolioAllocation[] | null;
  lifestyleProfile?: UserInfoLifestyleProfile | null;
}

export interface GetFinancialResponse {
  financial?: UserInfoFinancialResource | null;
}

export interface FinancialRequestPayload {
  financialProfile: UserInfoFinancialProfile;
  portfolioAllocations: UserInfoPortfolioAllocation[];
  lifestyleProfile: UserInfoLifestyleProfile;
}

export type CreateFinancialRequest = FinancialRequestPayload;
export interface PatchFinancialRequest {
  financial: FinancialRequestPayload;
}
export type CreateFinancialResponse = null;
export type PatchFinancialResponse = null;

export interface GetStagesResponse {
  stages?: UserInfoStageData[] | null;
  stageData?: UserInfoStageData[] | null;
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

export interface PatchUserInfoMeRequest {
  userInfo: {
    name?: string;
    birthYear?: number;
    countryId?: number;
    sexTypeId?: number;
  };
}

export type GetAssetsResponse =
  | UserInfoAssetResponse[]
  | {
      assets?: UserInfoAssetResponse[] | null;
      assetData?: UserInfoAssetResponse[] | null;
    };

export type CreateAssetsResponse = Array<{
  uid: string;
  initialAnnualIncome: number;
  growthRate: number;
}>;
