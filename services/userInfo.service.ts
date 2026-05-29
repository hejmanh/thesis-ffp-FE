import { userInfoApi } from "@/api/userInfo.api";
import type {
  CreateAssetsRequest,
  CreateAssetsResponse,
  CreateFinancialRequest,
  CreateStagesRequest,
  GetAssetsResponse,
  GetFinancialResponse,
  GetStagesResponse,
  PatchAssetsRequest,
  PatchUserInfoMeRequest,
  PatchStagesRequest,
  UserInfoAssetResponse,
  UserInfoFinancialResource,
  UserInfoStageData,
} from "@/types/userInfo";
import type { UserContextData } from "@/types/userContext";

const USER_INFO_NOT_FOUND_MESSAGE = "not found";

function isNotFoundResponse(
  message?: string | null,
  error?: string | null,
): boolean {
  return [message, error].some((value) =>
    value?.toLowerCase().includes(USER_INFO_NOT_FOUND_MESSAGE),
  );
}

function isGetFinancialResponse(
  data: GetFinancialResponse | UserInfoFinancialResource,
): data is GetFinancialResponse {
  return Object.prototype.hasOwnProperty.call(data, "financial");
}

function normalizeFinancialResponse(
  data: GetFinancialResponse | UserInfoFinancialResource | null | undefined,
): UserInfoFinancialResource | null {
  if (!data) {
    return null;
  }

  if (isGetFinancialResponse(data)) {
    return data.financial ?? null;
  }

  return data;
}

function normalizeStagesResponse(
  data: GetStagesResponse | CreateStagesRequest | null | undefined,
): UserInfoStageData[] {
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data;
  }

  return data.stages ?? data.stageData ?? [];
}

function normalizeAssetsResponse(
  data: GetAssetsResponse | null | undefined,
): UserInfoAssetResponse[] {
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data;
  }

  return data.assets ?? data.assetData ?? [];
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function readNullableNumber(value: unknown): number | null {
  if (value == null || value === "") {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function readRecord(value: unknown): Record<string, unknown> {
  return value != null && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeUserContextData(data: unknown): UserContextData {
  const source = readRecord(data);

  return {
    name: readString(source.name),
    email: readString(source.email),
    birthYear: readNullableNumber(source.birthYear),
    countryId: readNullableNumber(source.countryId),
    sexTypeId: readNullableNumber(source.sexTypeId),
    estimatedLifeExpectancy: readNullableNumber(source.estimatedLifeExpectancy),
    preferredCurrencyId: readNullableNumber(source.preferredCurrencyId),
  };
}

export const userInfoService = {
  async getMe(): Promise<UserContextData> {
    const res = await userInfoApi.getMe();
    if (!res.success || !res.data) {
      throw new Error(res.error ?? "Unable to load user context");
    }
    return normalizeUserContextData(res.data);
  },

  async patchMe(payload: PatchUserInfoMeRequest): Promise<UserContextData> {
    const res = await userInfoApi.patchMe(payload);
    if (!res.success || !res.data) {
      throw new Error(res.error ?? "Unable to update personal information");
    }
    return normalizeUserContextData(res.data);
  },

  async getFinancial(): Promise<UserInfoFinancialResource | null> {
    const res = await userInfoApi.getFinancial();
    if (isNotFoundResponse(res.message, res.error)) {
      return null;
    }
    if (!res.success) {
      throw new Error(res.error ?? "Unable to load financial information");
    }
    return normalizeFinancialResponse(res.data);
  },

  async createFinancial(payload: CreateFinancialRequest): Promise<void> {
    const res = await userInfoApi.createFinancial(payload);
    if (!res.success) {
      throw new Error(res.error ?? "Unable to create financial information");
    }
  },

  async patchFinancial(payload: CreateFinancialRequest): Promise<void> {
    const res = await userInfoApi.patchFinancial(payload);
    if (!res.success) {
      throw new Error(res.error ?? "Unable to update financial information");
    }
  },

  /** Try PATCH; fall back to POST only when the server confirms the resource does not exist yet. */
  async upsertFinancial(payload: CreateFinancialRequest): Promise<void> {
    const patchRes = await userInfoApi.patchFinancial(payload);
    if (isNotFoundResponse(patchRes.message, patchRes.error)) {
      const createRes = await userInfoApi.createFinancial(payload);
      if (!createRes.success) {
        throw new Error(
          createRes.error ?? "Unable to create financial information",
        );
      }
      return;
    }
    if (!patchRes.success) {
      throw new Error(
        patchRes.error ?? "Unable to update financial information",
      );
    }
  },

  async getStages(): Promise<UserInfoStageData[]> {
    const res = await userInfoApi.getStages();
    if (isNotFoundResponse(res.message, res.error)) {
      return [];
    }
    if (!res.success) {
      throw new Error(res.error ?? "Unable to load stages");
    }
    return normalizeStagesResponse(res.data);
  },

  async patchStages(payload: PatchStagesRequest): Promise<void> {
    const res = await userInfoApi.patchStages(payload);
    if (!res.success) {
      throw new Error(res.error ?? "Unable to update stages");
    }
  },

  /** Try PATCH; fall back to POST only when the server confirms the resource does not exist yet. */
  async upsertStages(payload: CreateStagesRequest): Promise<void> {
    const patchRes = await userInfoApi.patchStages(payload);
    if (isNotFoundResponse(patchRes.message, patchRes.error)) {
      const createRes = await userInfoApi.createStages(payload);
      if (!createRes.success) {
        throw new Error(createRes.error ?? "Unable to create stages");
      }
      return;
    }
    if (!patchRes.success) {
      throw new Error(patchRes.error ?? "Unable to update stages");
    }
  },

  async createStages(payload: CreateStagesRequest): Promise<void> {
    const res = await userInfoApi.createStages(payload);
    if (!res.success) {
      throw new Error(res.error ?? "Unable to create stages");
    }
  },

  async getAssets(): Promise<UserInfoAssetResponse[]> {
    const res = await userInfoApi.getAssets();
    if (isNotFoundResponse(res.message, res.error)) {
      return [];
    }
    if (!res.success) {
      throw new Error(res.error ?? "Unable to load assets");
    }
    return normalizeAssetsResponse(res.data);
  },

  async createAssets(
    payload: CreateAssetsRequest,
  ): Promise<CreateAssetsResponse> {
    const res = await userInfoApi.createAssets(payload);
    if (!res.success) {
      throw new Error(res.error ?? "Unable to create assets");
    }
    return res.data ?? [];
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
