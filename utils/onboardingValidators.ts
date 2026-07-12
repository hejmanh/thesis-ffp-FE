import type {
  AssetItem,
  StageItem,
  Step1AccountData,
  Step2PersonalData,
} from "@/types/onboarding";

export type Step1ValidationCode =
  | "requiredFields"
  | "invalidEmail"
  | "passwordMinLength"
  | "passwordComplexity"
  | "passwordMismatch";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_COMPLEXITY_PATTERN =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

// avoid falsy values like "0" or "false" to be considered as empty
function isFilledValue(value: unknown): boolean {
  if (value == null) {
    return false;
  }

  return String(value).trim() !== "";
}

export function validateStep1(data: Step1AccountData): Step1ValidationCode | null {
  if (
    !isFilledValue(data.name) ||
    !isFilledValue(data.email) ||
    !isFilledValue(data.password) ||
    !isFilledValue(data.confirmPassword) ||
    !isFilledValue(data.birthYear) ||
    !isFilledValue(data.country) ||
    !isFilledValue(data.sex)
  ) {
    return "requiredFields";
  }
  if (!EMAIL_PATTERN.test(data.email.trim())) {
    return "invalidEmail";
  }
  if (data.password.length < PASSWORD_MIN_LENGTH) {
    return "passwordMinLength";
  }
  if (!PASSWORD_COMPLEXITY_PATTERN.test(data.password)) {
    return "passwordComplexity";
  }
  if (data.password !== data.confirmPassword) {
    return "passwordMismatch";
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
    data.beforeFfp.sigma,
    data.afterFfp.u,
    data.afterFfp.mu,
    data.afterFfp.rf,
    data.afterFfp.sigma,
    data.habits.smoke,
    data.habits.physical,
    data.habits.diet,
    data.habits.alcohol,
  ];
  if (required.some((value) => !isFilledValue(value))) {
    return "Please complete all fields in General Information.";
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
