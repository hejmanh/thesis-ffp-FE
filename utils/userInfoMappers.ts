import type { OnboardingDraft, StageItem } from "@/types/onboarding";
import type { LifeStageRange } from "@/types/reference";
import type {
  CreateAssetsRequest,
  CreateUserInfoRequest,
  GetUserInfoResponse,
  PatchAssetsRequest,
  PatchBasicRequest,
  PatchLifestyleRequest,
  PatchPortfolioRequest,
  PatchStagesRequest,
  UserInfoAssetResponse,
  UserInfoResponse,
} from "@/types/userInfo";
import type { Asset, FinancialData, Habits, Stage } from "@/utils/types";

function parseRequiredNumber(value: string, fieldName: string): number {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  return parsedValue;
}

function parseRequiredInteger(value: string, fieldName: string): number {
  const parsedValue = Number(value);
  if (!Number.isInteger(parsedValue)) {
    throw new Error(`${fieldName} must be a valid integer`);
  }
  return parsedValue;
}

function isGetUserInfoResponse(
  response: GetUserInfoResponse | UserInfoResponse,
): response is GetUserInfoResponse {
  return Object.prototype.hasOwnProperty.call(response, "userInfo");
}

export function buildCreateUserInfoRequest(
  draft: OnboardingDraft,
): CreateUserInfoRequest {
  return {
    userInfo: {
      financialProfile: {
        desiredLifeExpectancy: parseRequiredNumber(
          draft.step2.desiredLifeExpectancy,
          "Desired life expectancy",
        ),
        currentSavings: parseRequiredNumber(
          draft.step2.currentSavings,
          "Current savings",
        ),
        currencyCode: draft.step2.preferredCurrency,
      },
      portfolioAllocations: [
        {
          allocationType: "PRE_FFP",
          u: parseRequiredNumber(draft.step2.beforeFfp.u, "Pre-FFP risky allocation"),
          mu: parseRequiredNumber(draft.step2.beforeFfp.mu, "Pre-FFP expected return"),
          rf: parseRequiredNumber(draft.step2.beforeFfp.rf, "Pre-FFP risk-free rate"),
        },
        {
          allocationType: "POST_FFP",
          u: parseRequiredNumber(draft.step2.afterFfp.u, "Post-FFP risky allocation"),
          mu: parseRequiredNumber(draft.step2.afterFfp.mu, "Post-FFP expected return"),
          rf: parseRequiredNumber(draft.step2.afterFfp.rf, "Post-FFP risk-free rate"),
        },
      ],
      lifestyleProfile: {
        smokingCode: draft.step2.habits.smoke,
        physicalActivityCode: draft.step2.habits.physical,
        dietQualityCode: draft.step2.habits.diet,
        alcoholConsumptionCode: draft.step2.habits.alcohol,
      },
      stageData: draft.stages.map((stage) => ({
        lifeStageRangeId: stage.lifeStageRangeId,
        initialAnnualSavings: parseRequiredNumber(
          stage.annualSaving,
          "Initial annual savings",
        ),
        growthRate: parseRequiredNumber(stage.annualRate, "Stage growth rate"),
      })),
      assetData: draft.assets.map((asset) => ({
        assetTypeId: parseRequiredInteger(asset.assetTypeId, "Asset type"),
        initialAnnualIncome: parseRequiredNumber(
          asset.initialAnnualIncome,
          "Initial annual income",
        ),
        growthRate: parseRequiredNumber(asset.growthRate, "Asset growth rate"),
      })),
    },
  };
}

export function buildStageItemsFromRanges(
  ranges: LifeStageRange[],
  existingStages: StageItem[],
  currency: string,
): StageItem[] {
  const existingByRangeId = new Map(
    existingStages.map((stage) => [stage.lifeStageRangeId, stage]),
  );

  return [...ranges]
    .sort((left, right) => left.stageNo - right.stageNo)
    .map((range, index) => {
      const existingStage =
        existingByRangeId.get(range.id) ?? existingStages[index];

      return {
        id: existingStage?.id ?? crypto.randomUUID(),
        lifeStageRangeId: range.id,
        stageNo: range.stageNo,
        title: range.title ?? `Stage ${range.stageNo}`,
        ageStart: String(range.beginningAge),
        ageEnd: String(range.endingAge),
        annualSaving: existingStage?.annualSaving ?? "",
        currency,
        annualRate: existingStage?.annualRate ?? "",
      };
    });
}

export function mapUserInfoToFinancialData(
  response: GetUserInfoResponse | UserInfoResponse,
): FinancialData {
  const userInfo: UserInfoResponse | null | undefined =
    isGetUserInfoResponse(response) ? response.userInfo : response;
  const financialProfile = userInfo?.financialProfile;
  const portfolioAllocations = userInfo?.portfolioAllocations ?? [];
  const lifestyleProfile = userInfo?.lifestyleProfile;
  const stageData = userInfo?.stageData ?? [];
  const assetData = userInfo?.assetData ?? [];
  const preFfpAllocation = portfolioAllocations.find(
    (allocation) => allocation.allocationType === "PRE_FFP",
  );
  const postFfpAllocation = portfolioAllocations.find(
    (allocation) => allocation.allocationType === "POST_FFP",
  );

  return {
    estimatedLE:
      financialProfile?.estimatedLifeExpectancy == null
        ? ""
        : String(financialProfile.estimatedLifeExpectancy),
    savings:
      financialProfile?.currentSavings == null
        ? ""
        : String(financialProfile.currentSavings),
    currency: financialProfile?.currencyCode ?? "",
    desiredLE:
      financialProfile?.desiredLifeExpectancy == null
        ? ""
        : String(financialProfile.desiredLifeExpectancy),
    allocation: {
      before: {
        u: preFfpAllocation ? String(preFfpAllocation.u) : "",
        mu: preFfpAllocation ? String(preFfpAllocation.mu) : "",
        rf: preFfpAllocation ? String(preFfpAllocation.rf) : "",
      },
      after: {
        u: postFfpAllocation ? String(postFfpAllocation.u) : "",
        mu: postFfpAllocation ? String(postFfpAllocation.mu) : "",
        rf: postFfpAllocation ? String(postFfpAllocation.rf) : "",
      },
    },
    habits: {
      smoking: lifestyleProfile?.smokingCode ?? "",
      physical: lifestyleProfile?.physicalActivityCode ?? "",
      diet: lifestyleProfile?.dietQualityCode ?? "",
      alcohol: lifestyleProfile?.alcoholConsumptionCode ?? "",
    },
    stages: stageData.map((stage, index) => ({
      lifeStageRangeId: stage.lifeStageRangeId,
      title: `Stage ${index + 1}`,
      startAge: "",
      endAge: "",
      annualSaving: String(stage.initialAnnualSavings),
      currency: financialProfile?.currencyCode ?? "",
      growthRate: String(stage.growthRate),
    })),
    assets: assetData.map((asset) => mapUserInfoAssetToAsset(asset)),
  };
}

export function buildAccountStagesFromRanges(
  ranges: LifeStageRange[],
  existingStages: Stage[],
  currency: string,
): Stage[] {
  const existingByRangeId = new Map(
    existingStages.map((stage) => [stage.lifeStageRangeId, stage]),
  );

  return [...ranges]
    .sort((left, right) => left.stageNo - right.stageNo)
    .map((range, index) => {
      const existingStage =
        existingByRangeId.get(range.id) ?? existingStages[index];

      return {
        lifeStageRangeId: range.id,
        title: range.title ?? existingStage?.title ?? `Stage ${range.stageNo}`,
        startAge: String(range.beginningAge),
        endAge: String(range.endingAge),
        annualSaving: existingStage?.annualSaving ?? "",
        currency,
        growthRate: existingStage?.growthRate ?? "",
      };
    });
}

export function mapUserInfoAssetToAsset(asset: UserInfoAssetResponse): Asset {
  return {
    id: asset.uid,
    uid: asset.uid,
    assetTypeId: String(asset.assetId),
    assetTypeCode: asset.assetTypeCode ?? undefined,
    assetTypeTitle: asset.assetTypeTitle ?? undefined,
    initialAnnualIncome: String(asset.initialAnnualIncome),
    growthRate: String(asset.growthRate),
  };
}

export function buildPatchBasicRequest(
  profile: Pick<FinancialData, "savings" | "desiredLE" | "currency">,
): PatchBasicRequest {
  return {
    currentSavings: parseRequiredNumber(profile.savings, "Current savings"),
    desiredLifeExpectancy: parseRequiredNumber(
      profile.desiredLE,
      "Desired life expectancy",
    ),
    currencyCode: profile.currency,
  };
}

export function buildPatchPortfolioRequest(
  allocation: FinancialData["allocation"],
): PatchPortfolioRequest {
  return [
    {
      allocationType: "PRE_FFP",
      u: parseRequiredNumber(
        allocation.before.u,
        "Pre-FFP risky allocation",
      ),
      mu: parseRequiredNumber(
        allocation.before.mu,
        "Pre-FFP expected return",
      ),
      rf: parseRequiredNumber(
        allocation.before.rf,
        "Pre-FFP risk-free rate",
      ),
    },
    {
      allocationType: "POST_FFP",
      u: parseRequiredNumber(
        allocation.after.u,
        "Post-FFP risky allocation",
      ),
      mu: parseRequiredNumber(
        allocation.after.mu,
        "Post-FFP expected return",
      ),
      rf: parseRequiredNumber(
        allocation.after.rf,
        "Post-FFP risk-free rate",
      ),
    },
  ];
}

export function buildPatchLifestyleRequest(
  habits: Habits,
): PatchLifestyleRequest {
  return {
    smokingCode: habits.smoking,
    physicalActivityCode: habits.physical,
    dietQualityCode: habits.diet,
    alcoholConsumptionCode: habits.alcohol,
  };
}

export function buildPatchStagesRequest(stages: Stage[]): PatchStagesRequest {
  return stages.map((stage) => ({
      lifeStageRangeId: stage.lifeStageRangeId ?? 0,
      initialAnnualSavings: parseRequiredNumber(
        stage.annualSaving,
        "Initial annual savings",
      ),
      growthRate: parseRequiredNumber(stage.growthRate, "Stage growth rate"),
    }));
}

export function buildCreateAssetsRequest(assets: Asset[]): CreateAssetsRequest {
  return {
    assetData: assets.map((asset) => ({
      assetTypeId: parseRequiredInteger(asset.assetTypeId, "Asset type"),
      initialAnnualIncome: parseRequiredNumber(
        asset.initialAnnualIncome,
        "Initial annual income",
      ),
      growthRate: parseRequiredNumber(asset.growthRate, "Asset growth rate"),
    })),
  };
}

export function buildPatchAssetsRequest(assets: Asset[]): PatchAssetsRequest {
  return assets.map((asset) => ({
    uid: asset.uid ?? "",
    initialAnnualIncome: parseRequiredNumber(
      asset.initialAnnualIncome,
      "Initial annual income",
    ),
    growthRate: parseRequiredNumber(asset.growthRate, "Asset growth rate"),
  }));
}
