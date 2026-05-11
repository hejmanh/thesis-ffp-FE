import type { StageItem } from "@/types/onboarding";
import type { Stage } from "@/utils/types";

export const DEFAULT_STAGE_COUNT = 6;

function toNumber(value: string | number): number | null {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

export function getCurrentAgeFromBirthYear(birthYear: string | number): number | null {
  const birthYearValue = toNumber(birthYear);
  if (birthYearValue === null) {
    return null;
  }

  return Math.max(0, new Date().getFullYear() - birthYearValue);
}

export function buildStageAgeRanges(
  birthYear: string | number,
  desiredLifeExpectancy: string | number,
  stageCount: number = DEFAULT_STAGE_COUNT
): Array<{ startAge: string; endAge: string }> {
  const currentAge = getCurrentAgeFromBirthYear(birthYear);
  const desiredAgeValue = toNumber(desiredLifeExpectancy);

  if (currentAge === null || desiredAgeValue === null || desiredAgeValue < currentAge) {
    return [];
  }

  const totalYears = desiredAgeValue - currentAge + 1;
  let nextStartAge = currentAge;

  return Array.from({ length: stageCount }, (_, index) => {
    const computedEndAge =
      currentAge + Math.floor((totalYears * (index + 1)) / stageCount) - 1;
    const endAge = index === stageCount - 1 ? desiredAgeValue : Math.max(nextStartAge, computedEndAge);
    const range = {
      startAge: String(nextStartAge),
      endAge: String(endAge),
    };

    nextStartAge = endAge + 1;
    return range;
  });
}

export function buildPreconfiguredStageItems(
  existingStages: StageItem[],
  birthYear: string | number,
  desiredLifeExpectancy: string | number,
  currency: string
): StageItem[] {
  return buildStageAgeRanges(birthYear, desiredLifeExpectancy).map((range, index) => ({
    id: existingStages[index]?.id ?? crypto.randomUUID(),
    ageStart: range.startAge,
    ageEnd: range.endAge,
    annualSaving: existingStages[index]?.annualSaving ?? "",
    annualRate: existingStages[index]?.annualRate ?? "",
    currency,
  }));
}

export function buildPreconfiguredStages(
  existingStages: Stage[],
  birthYear: string | number,
  desiredLifeExpectancy: string | number,
  currency: string
): Stage[] {
  return buildStageAgeRanges(birthYear, desiredLifeExpectancy).map((range, index) => ({
    startAge: range.startAge,
    endAge: range.endAge,
    annualSaving: existingStages[index]?.annualSaving ?? "",
    growthRate: existingStages[index]?.growthRate ?? "",
    currency,
  }));
}
