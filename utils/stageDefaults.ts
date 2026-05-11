import type { StageItem } from "@/types/onboarding";
import type { Stage } from "@/utils/types";

export const DEFAULT_STAGE_COUNT = 6;

export const HARDCODED_STAGE_RANGES = [
  { startAge: "25", endAge: "34" },
  { startAge: "35", endAge: "44" },
  { startAge: "45", endAge: "54" },
  { startAge: "55", endAge: "64" },
  { startAge: "65", endAge: "74" },
  { startAge: "75", endAge: "85" },
] as const;

export function buildHardcodedStageItems(existingStages: StageItem[], currency: string): StageItem[] {
  return HARDCODED_STAGE_RANGES.map((range, index) => ({
    id: existingStages[index]?.id ?? crypto.randomUUID(),
    ageStart: range.startAge,
    ageEnd: range.endAge,
    annualSaving: existingStages[index]?.annualSaving ?? "",
    annualRate: existingStages[index]?.annualRate ?? "",
    currency: existingStages[index]?.currency ?? currency,
  }));
}

export function buildHardcodedStages(existingStages: Stage[], currency: string): Stage[] {
  return HARDCODED_STAGE_RANGES.map((range, index) => ({
    startAge: range.startAge,
    endAge: range.endAge,
    annualSaving: existingStages[index]?.annualSaving ?? "",
    growthRate: existingStages[index]?.growthRate ?? "",
    currency: existingStages[index]?.currency ?? currency,
  }));
}
