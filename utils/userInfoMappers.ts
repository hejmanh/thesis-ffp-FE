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

function normalizeNumericInput(value: string): string {
  return value.replace(/\s+/g, "").trim();
}

function parseRequiredNumber(value: string, fieldName: string): number {
  const normalizedValue = normalizeNumericInput(value);
  if (normalizedValue === "") {
    throw new Error(`${fieldName} is required`);
  }
  const parsedValue = Number(normalizedValue);
  if (!Number.isFinite(parsedValue)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  return parsedValue;
}

function parsePercentInRangeToRatio(
  value: string,
  fieldName: string,
  minPercent: number,
  maxPercent: number,
): number {
  const parsedValue = parseRequiredNumber(value, fieldName);
  if (parsedValue < minPercent || parsedValue > maxPercent) {
    throw new Error(
      `${fieldName} must be between ${minPercent} and ${maxPercent}`,
    );
  }
  return parsedValue / 100;
}

function parsePercentGreaterThanMinus100ToRatio(
  value: string,
  fieldName: string,
): number {
  const parsedValue = parseRequiredNumber(value, fieldName);
  if (parsedValue <= -100) {
    throw new Error(`${fieldName} must be greater than -100`);
  }
  return parsedValue / 100;
}

function parseNonNegativePercentToRatio(
  value: string,
  fieldName: string,
): number {
  const parsedValue = parseRequiredNumber(value, fieldName);
  if (parsedValue < 0) {
    throw new Error(`${fieldName} must be at least 0`);
  }
  return parsedValue / 100;
}

function parseNumberAtLeast(
  value: string,
  fieldName: string,
  minValue: number,
): number {
  const parsedValue = parseRequiredNumber(value, fieldName);
  if (parsedValue < minValue) {
    throw new Error(`${fieldName} must be at least ${minValue}`);
  }
  return parsedValue;
}

function parseIntegerInRange(
  value: string,
  fieldName: string,
  minValue: number,
  maxValue: number,
): number {
  const parsedValue = parseRequiredInteger(value, fieldName);
  if (parsedValue < minValue || parsedValue > maxValue) {
    throw new Error(
      `${fieldName} must be between ${minValue} and ${maxValue}`,
    );
  }
  return parsedValue;
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

function formatOptionalAge(value: number | null | undefined): string {
  return value == null ? "" : String(value);
}

export function buildCreateFinancialRequestFromOnboarding(
  draft: OnboardingDraft,
): CreateFinancialRequest {
  return {
    financialProfile: {
      desiredLifeExpectancy: parseIntegerInRange(
        draft.step2.desiredLifeExpectancy,
        "Desired life expectancy",
        1,
        150,
      ),
      currentSavings: parseNumberAtLeast(
        draft.step2.currentSavings,
        "Current savings",
        0,
      ),
      currencyId: parseRequiredInteger(
        draft.step2.preferredCurrency,
        "Preferred currency",
      ),
    },
    portfolioAllocations: [
      {
        allocationType: "PRE_FFP",
        u: parsePercentInRangeToRatio(
          draft.step2.beforeFfp.u,
          "Pre-SRP risky allocation",
          0,
          100,
        ),
        mu: parsePercentGreaterThanMinus100ToRatio(
          draft.step2.beforeFfp.mu,
          "Pre-SRP expected return",
        ),
        rf: parsePercentGreaterThanMinus100ToRatio(
          draft.step2.beforeFfp.rf,
          "Pre-SRP risk-free rate",
        ),
        sigma: parseNonNegativePercentToRatio(
          draft.step2.beforeFfp.sigma,
          "Pre-SRP risky asset volatility",
        ),
      },
      {
        allocationType: "POST_FFP",
        u: parsePercentInRangeToRatio(
          draft.step2.afterFfp.u,
          "Post-SRP risky allocation",
          0,
          100,
        ),
        mu: parsePercentGreaterThanMinus100ToRatio(
          draft.step2.afterFfp.mu,
          "Post-SRP expected return",
        ),
        rf: parsePercentGreaterThanMinus100ToRatio(
          draft.step2.afterFfp.rf,
          "Post-SRP risk-free rate",
        ),
        sigma: parseNonNegativePercentToRatio(
          draft.step2.afterFfp.sigma,
          "Post-SRP risky asset volatility",
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
      currentSavings: parseNumberAtLeast(profile.savings, "Current savings", 0),
      desiredLifeExpectancy: parseIntegerInRange(
        profile.desiredLE,
        "Desired life expectancy",
        1,
        150,
      ),
      currencyId: parseRequiredInteger(profile.currency, "Preferred currency"),
    },
    portfolioAllocations: [
      {
        allocationType: "PRE_FFP",
        u: parsePercentInRangeToRatio(
          allocation.before.u,
          "Pre-SRP risky allocation",
          0,
          100,
        ),
        mu: parsePercentGreaterThanMinus100ToRatio(
          allocation.before.mu,
          "Pre-SRP expected return",
        ),
        rf: parsePercentGreaterThanMinus100ToRatio(
          allocation.before.rf,
          "Pre-SRP risk-free rate",
        ),
        sigma: parseNonNegativePercentToRatio(
          allocation.before.sigma,
          "Pre-SRP risky asset volatility",
        ),
      },
      {
        allocationType: "POST_FFP",
        u: parsePercentInRangeToRatio(
          allocation.after.u,
          "Post-SRP risky allocation",
          0,
          100,
        ),
        mu: parsePercentGreaterThanMinus100ToRatio(
          allocation.after.mu,
          "Post-SRP expected return",
        ),
        rf: parsePercentGreaterThanMinus100ToRatio(
          allocation.after.rf,
          "Post-SRP risk-free rate",
        ),
        sigma: parseNonNegativePercentToRatio(
          allocation.after.sigma,
          "Post-SRP risky asset volatility",
        ),
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
        ageStart: formatOptionalAge(range.beginningAge),
        ageEnd: formatOptionalAge(range.endingAge),
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
        sigma:
          preFfpAllocation?.sigma == null
            ? ""
            : ratioToPercent(preFfpAllocation.sigma),
      },
      after: {
        u: postFfpAllocation ? ratioToPercent(postFfpAllocation.u) : "",
        mu: postFfpAllocation ? ratioToPercent(postFfpAllocation.mu) : "",
        rf: postFfpAllocation ? ratioToPercent(postFfpAllocation.rf) : "",
        sigma:
          postFfpAllocation?.sigma == null
            ? ""
            : ratioToPercent(postFfpAllocation.sigma),
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
      growthRate: ratioToPercent(stage.growthRate),
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
        startAge: formatOptionalAge(range.beginningAge),
        endAge: formatOptionalAge(range.endingAge),
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
    growthRate: ratioToPercent(asset.growthRate),
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
  if (stages.length < 1) {
    throw new Error("At least one stage must be provided");
  }

  const seenLifeStageRangeIds = new Set<number>();

  return stages.map((stage, index) => {
    if (stage.lifeStageRangeId == null || stage.lifeStageRangeId === 0) {
      throw new Error(
        `Stage at index ${index} is missing a valid lifeStageRangeId`,
      );
    }
    if (seenLifeStageRangeIds.has(stage.lifeStageRangeId)) {
      throw new Error(
        `Duplicate life stage range id: ${stage.lifeStageRangeId}`,
      );
    }
    seenLifeStageRangeIds.add(stage.lifeStageRangeId);

    return {
      lifeStageRangeId: stage.lifeStageRangeId,
      initialAnnualSavings: parseRequiredNumber(
        stage.annualSaving,
        "Initial annual savings",
      ),
      growthRate: parsePercentGreaterThanMinus100ToRatio(
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
  if (assets.length < 1) {
    throw new Error("At least one asset must be provided");
  }

  const seenAssetTypeIds = new Set<number>();

  return {
    assetData: assets.map((asset) => {
      const assetTypeId = parseRequiredInteger(asset.assetTypeId, "Asset type");
      if (seenAssetTypeIds.has(assetTypeId)) {
        throw new Error(`Duplicate asset type id: ${assetTypeId}`);
      }
      seenAssetTypeIds.add(assetTypeId);

      return {
        assetTypeId,
        initialAnnualIncome: parseNumberAtLeast(
          asset.initialAnnualIncome,
          "Initial annual income",
          0,
        ),
        growthRate: parsePercentGreaterThanMinus100ToRatio(
          asset.growthRate,
          "Asset growth rate",
        ),
      };
    }),
  };
}

export function buildPatchAssetsRequest(assets: Asset[]): PatchAssetsRequest {
  if (assets.length < 1) {
    throw new Error("At least one asset must be provided");
  }

  const seenUids = new Set<string>();

  return assets.map((asset) => ({
    uid: (() => {
      const uid = asset.uid ?? "";
      if (!uid) {
        throw new Error("Asset uid is required");
      }
      if (seenUids.has(uid)) {
        throw new Error(`Duplicate uid: ${uid}`);
      }
      seenUids.add(uid);
      return uid;
    })(),
    initialAnnualIncome: parseNumberAtLeast(
      asset.initialAnnualIncome,
      "Initial annual income",
      0,
    ),
    growthRate: parsePercentGreaterThanMinus100ToRatio(
      asset.growthRate,
      "Asset growth rate",
    ),
  }));
}
