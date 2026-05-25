import type { OnboardingDraft, StageItem } from "@/types/onboarding";
import type { LifeStageRange } from "@/types/reference";
import type {
  CreateAssetsRequest,
  CreateFinancialRequest,
  PatchAssetsRequest,
  UserInfoAssetResponse,
  UserInfoFinancialResource,
  UserInfoStageData,
} from "@/types/userInfo";
import type { Asset, FinancialData, Habits, Stage } from "@/utils/types";

function parseRequiredNumber(value: string, fieldName: string): number {
  const trimmed = value.trim();
  if (trimmed === "") {
    throw new Error(`${fieldName} is required`);
  }
  const parsedValue = Number(trimmed);
  if (!Number.isFinite(parsedValue)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  return parsedValue;
}

function parsePercentToRatio(value: string, fieldName: string): number {
  return parseRequiredNumber(value, fieldName) / 100;
}

function ratioToPercent(value: number): string {
  return String(value * 100);
}

function parseRequiredInteger(value: string, fieldName: string): number {
  const trimmed = value.trim();
  if (trimmed === "") {
    throw new Error(`${fieldName} is required`);
  }
  const parsedValue = Number(trimmed);
  if (!Number.isInteger(parsedValue)) {
    throw new Error(`${fieldName} must be a valid integer`);
  }
  return parsedValue;
}

export function buildCreateFinancialRequestFromOnboarding(
  draft: OnboardingDraft,
): CreateFinancialRequest {
  return {
    financialProfile: {
      desiredLifeExpectancy: parseRequiredNumber(
        draft.step2.desiredLifeExpectancy,
        "Desired life expectancy",
      ),
      currentSavings: parseRequiredNumber(
        draft.step2.currentSavings,
        "Current savings",
      ),
      currencyId: parseRequiredInteger(
        draft.step2.preferredCurrency,
        "Preferred currency",
      ),
    },
    portfolioAllocations: [
      {
        allocationType: "PRE_FFP",
        u: parsePercentToRatio(
          draft.step2.beforeFfp.u,
          "Pre-FFP risky allocation",
        ),
        mu: parsePercentToRatio(
          draft.step2.beforeFfp.mu,
          "Pre-FFP expected return",
        ),
        rf: parsePercentToRatio(
          draft.step2.beforeFfp.rf,
          "Pre-FFP risk-free rate",
        ),
      },
      {
        allocationType: "POST_FFP",
        u: parsePercentToRatio(
          draft.step2.afterFfp.u,
          "Post-FFP risky allocation",
        ),
        mu: parsePercentToRatio(
          draft.step2.afterFfp.mu,
          "Post-FFP expected return",
        ),
        rf: parsePercentToRatio(
          draft.step2.afterFfp.rf,
          "Post-FFP risk-free rate",
        ),
      },
    ],
    lifestyleProfile: {
      smokingTypeId: parseRequiredInteger(
        draft.step2.habits.smoke,
        "Smoking type",
      ),
      physicalActivityTypeId: parseRequiredInteger(
        draft.step2.habits.physical,
        "Physical activity type",
      ),
      dietQualityTypeId: parseRequiredInteger(
        draft.step2.habits.diet,
        "Diet quality type",
      ),
      alcoholConsumptionTypeId: parseRequiredInteger(
        draft.step2.habits.alcohol,
        "Alcohol consumption type",
      ),
    },
  };
}

export function buildFinancialRequestFromFinancialData(
  profile: Pick<FinancialData, "savings" | "desiredLE" | "currency">,
  allocation: FinancialData["allocation"],
  habits: Habits,
): CreateFinancialRequest {
  return {
    financialProfile: {
      currentSavings: parseRequiredNumber(profile.savings, "Current savings"),
      desiredLifeExpectancy: parseRequiredNumber(
        profile.desiredLE,
        "Desired life expectancy",
      ),
      currencyId: parseRequiredInteger(profile.currency, "Preferred currency"),
    },
    portfolioAllocations: [
      {
        allocationType: "PRE_FFP",
        u: parsePercentToRatio(allocation.before.u, "Pre-FFP risky allocation"),
        mu: parsePercentToRatio(
          allocation.before.mu,
          "Pre-FFP expected return",
        ),
        rf: parsePercentToRatio(allocation.before.rf, "Pre-FFP risk-free rate"),
      },
      {
        allocationType: "POST_FFP",
        u: parsePercentToRatio(allocation.after.u, "Post-FFP risky allocation"),
        mu: parsePercentToRatio(
          allocation.after.mu,
          "Post-FFP expected return",
        ),
        rf: parsePercentToRatio(allocation.after.rf, "Post-FFP risk-free rate"),
      },
    ],
    lifestyleProfile: {
      smokingTypeId: parseRequiredInteger(habits.smoking, "Smoking type"),
      physicalActivityTypeId: parseRequiredInteger(
        habits.physical,
        "Physical activity type",
      ),
      dietQualityTypeId: parseRequiredInteger(habits.diet, "Diet quality type"),
      alcoholConsumptionTypeId: parseRequiredInteger(
        habits.alcohol,
        "Alcohol consumption type",
      ),
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

export function mapUserInfoResourcesToFinancialData({
  financial,
  stages,
  assets,
}: {
  financial?: UserInfoFinancialResource | null;
  stages?: UserInfoStageData[] | null;
  assets?: UserInfoAssetResponse[] | null;
}): FinancialData {
  const financialProfile = financial?.financialProfile;
  const portfolioAllocations = financial?.portfolioAllocations ?? [];
  const lifestyleProfile = financial?.lifestyleProfile;
  const stageData = stages ?? [];
  const assetData = assets ?? [];
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
    currency:
      financialProfile?.currencyId == null
        ? ""
        : String(financialProfile.currencyId),
    desiredLE:
      financialProfile?.desiredLifeExpectancy == null
        ? ""
        : String(financialProfile.desiredLifeExpectancy),
    allocation: {
      before: {
        u: preFfpAllocation ? ratioToPercent(preFfpAllocation.u) : "",
        mu: preFfpAllocation ? ratioToPercent(preFfpAllocation.mu) : "",
        rf: preFfpAllocation ? ratioToPercent(preFfpAllocation.rf) : "",
      },
      after: {
        u: postFfpAllocation ? ratioToPercent(postFfpAllocation.u) : "",
        mu: postFfpAllocation ? ratioToPercent(postFfpAllocation.mu) : "",
        rf: postFfpAllocation ? ratioToPercent(postFfpAllocation.rf) : "",
      },
    },
    habits: {
      smoking:
        lifestyleProfile?.smokingTypeId == null
          ? ""
          : String(lifestyleProfile.smokingTypeId),
      physical:
        lifestyleProfile?.physicalActivityTypeId == null
          ? ""
          : String(lifestyleProfile.physicalActivityTypeId),
      diet:
        lifestyleProfile?.dietQualityTypeId == null
          ? ""
          : String(lifestyleProfile.dietQualityTypeId),
      alcohol:
        lifestyleProfile?.alcoholConsumptionTypeId == null
          ? ""
          : String(lifestyleProfile.alcoholConsumptionTypeId),
    },
    stages: stageData.map((stage, index) => ({
      lifeStageRangeId: stage.lifeStageRangeId,
      title: `Stage ${index + 1}`,
      startAge: "",
      endAge: "",
      annualSaving: String(stage.initialAnnualSavings),
      currency:
        financialProfile?.currencyId == null
          ? ""
          : String(financialProfile.currencyId),
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

type StageRequestStage = Pick<
  Stage,
  "annualSaving" | "growthRate" | "lifeStageRangeId"
>;

type StageRequestStageItem = Pick<
  StageItem,
  "lifeStageRangeId" | "annualSaving" | "annualRate"
>;

export function buildStagesRequest(
  stages: Array<StageRequestStage | StageRequestStageItem>,
): UserInfoStageData[] {
  return stages.map((stage, index) => {
    if (stage.lifeStageRangeId == null || stage.lifeStageRangeId === 0) {
      throw new Error(
        `Stage at index ${index} is missing a valid lifeStageRangeId`,
      );
    }
    return {
      lifeStageRangeId: stage.lifeStageRangeId,
      initialAnnualSavings: parseRequiredNumber(
        stage.annualSaving,
        "Initial annual savings",
      ),
      growthRate: parseRequiredNumber(
        "annualRate" in stage ? stage.annualRate : stage.growthRate,
        "Stage growth rate",
      ),
    };
  });
}

type AssetRequestAsset = Pick<
  Asset,
  "assetTypeId" | "initialAnnualIncome" | "growthRate"
>;

export function buildCreateAssetsRequest(
  assets: AssetRequestAsset[],
): CreateAssetsRequest {
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
