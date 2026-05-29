import type {
  AssetItem,
  StageItem,
  Step1AccountData,
  Step2PersonalData,
} from "@/types/onboarding";

// avoid falsy values like "0" or "false" to be considered as empty
function isFilledValue(value: unknown): boolean {
  if (value == null) {
    return false;
  }

  return String(value).trim() !== "";
}

export function validateStep1(data: Step1AccountData): string | null {
  if (
    !isFilledValue(data.name) ||
    !isFilledValue(data.email) ||
    !isFilledValue(data.password) ||
    !isFilledValue(data.confirmPassword) ||
    !isFilledValue(data.birthYear) ||
    !isFilledValue(data.country) ||
    !isFilledValue(data.sex)
  ) {
    return "Please fill all required fields.";
  }
  if (data.password !== data.confirmPassword) {
    return "Password and confirm password must match.";
  }
  return null;
}

export function validateStep2(data: Step2PersonalData): string | null {
  const required = [
    data.estimatedLifeExpectancy,
    data.currentSavings,
    data.preferredCurrency,
    data.desiredLifeExpectancy,
    data.beforeFfp.u,
    data.beforeFfp.mu,
    data.beforeFfp.rf,
    data.afterFfp.u,
    data.afterFfp.mu,
    data.afterFfp.rf,
    data.habits.smoke,
    data.habits.physical,
    data.habits.diet,
    data.habits.alcohol,
  ];
  if (required.some((value) => !isFilledValue(value))) {
    return "Please complete all fields in Personal Information.";
  }
  return null;
}

export function isStageComplete(stage: StageItem): boolean {
  const isFilled = (value?: string) => value != null && value.trim() !== "";
  return Boolean(
    stage.lifeStageRangeId &&
    isFilled(stage.ageStart) &&
    isFilled(stage.annualSaving) &&
    isFilled(stage.currency) &&
    isFilled(stage.annualRate),
  );
}

export function isAssetComplete(asset: AssetItem): boolean {
  const isFilled = (value?: string) => value != null && value.trim() !== "";
  return Boolean(
    asset.assetTypeId &&
    isFilled(asset.initialAnnualIncome) &&
    isFilled(asset.growthRate),
  );
}
