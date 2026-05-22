import { api } from "@/lib/apiRequest";
import type { ApiResponse } from "@/shared/config/api";
import type {
  AlcoholConsumptionType,
  AssetType,
  Country,
  Currency,
  DietQualityType,
  EstimateLifeExpectancyData,
  LifeStageRange,
  PhysicalActivityType,
  SexType,
  SmokingType,
} from "@/types/reference";
import { API_ENDPOINTS } from "@/api/endpoints";

export const referenceApi = {
  getEstimateLifeExpectancy: (): Promise<ApiResponse<EstimateLifeExpectancyData>> =>
    api.get(API_ENDPOINTS.reference.estimateLifeExpectancy),
  getCurrencies: (): Promise<ApiResponse<Currency[]>> =>
    api.get(API_ENDPOINTS.reference.currencies),
  getCountries: (): Promise<ApiResponse<Country[]>> =>
    api.get(API_ENDPOINTS.reference.countries),
  getSexTypes: (): Promise<ApiResponse<SexType[]>> =>
    api.get(API_ENDPOINTS.reference.sexTypes),
  getAssetTypes: (): Promise<ApiResponse<AssetType[]>> =>
    api.get(API_ENDPOINTS.reference.assetTypes),
  getLifeStageRanges: (birthYear: number): Promise<ApiResponse<LifeStageRange[]>> =>
    api.get(API_ENDPOINTS.reference.lifeStageRanges, {
      params: { birthYear },
    }),
  getSmokingTypes: (): Promise<ApiResponse<SmokingType[]>> =>
    api.get(API_ENDPOINTS.reference.smokingTypes),
  getPhysicalActivityTypes: (): Promise<ApiResponse<PhysicalActivityType[]>> =>
    api.get(API_ENDPOINTS.reference.physicalActivityTypes),
  getDietQualityTypes: (): Promise<ApiResponse<DietQualityType[]>> =>
    api.get(API_ENDPOINTS.reference.dietQualityTypes),
  getAlcoholConsumptionTypes: (): Promise<ApiResponse<AlcoholConsumptionType[]>> =>
    api.get(API_ENDPOINTS.reference.alcoholConsumptionTypes),
};
