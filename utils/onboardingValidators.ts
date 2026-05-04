import type { AssetItem, StageItem, Step1AccountData, Step2PersonalData } from "@/types/onboarding";

export function validateStep1(data: Step1AccountData): string | null {
  if (!data.email || !data.password || !data.confirmPassword || !data.birthYear || !data.country || !data.sex) {
    return "Please fill all required fields.";
  }
  if (data.password !== data.confirmPassword) {
    return "Password and confirm password must match.";
  }
  return null;
}

export function validateStep2(data: Step2PersonalData): string | null {
  const required = [
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
  if (required.some((value) => !value)) {
    return "Please complete all fields in Personal Information.";
  }
  return null;
}

export function isStageComplete(stage: StageItem): boolean {
  return Boolean(stage.ageStart && stage.ageEnd && stage.annualSaving && stage.currency && stage.annualRate);
}

export function isAssetComplete(asset: AssetItem): boolean {
  return Boolean(asset.name && asset.amount && asset.currency && asset.type && asset.growthRate);
}
