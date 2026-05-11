"use client";

import { useEffect } from "react";
import Button from "@/components/common/Button";
import StageCardEditor from "@/components/register/cards/StageCardEditor";
import type { StageItem } from "@/types/onboarding";
import { isStageComplete } from "@/utils/onboardingValidators";
import { buildPreconfiguredStageItems, DEFAULT_STAGE_COUNT } from "@/utils/stageDefaults";

interface Step3StagesCardsProps {
  birthYear: string;
  desiredLifeExpectancy: string;
  preferredCurrency: string;
  stages: StageItem[];
  error: string;
  onBack: () => void;
  onNext: () => void;
  onChange: (stages: StageItem[]) => void;
}

export default function Step3StagesCards({
  birthYear,
  desiredLifeExpectancy,
  preferredCurrency,
  stages,
  error,
  onBack,
  onNext,
  onChange,
}: Step3StagesCardsProps) {
  useEffect(() => {
    const generatedStages = buildPreconfiguredStageItems(
      stages,
      birthYear,
      desiredLifeExpectancy,
      preferredCurrency
    );

    const shouldUpdate =
      generatedStages.length === DEFAULT_STAGE_COUNT &&
      JSON.stringify(generatedStages) !== JSON.stringify(stages);

    if (shouldUpdate) {
      onChange(generatedStages);
    }
  }, [birthYear, desiredLifeExpectancy, preferredCurrency, stages, onChange]);

  function handleSave(updated: StageItem) {
    onChange(stages.map((stage) => (stage.id === updated.id ? updated : stage)));
  }

  const canContinue = stages.length > 0 && stages.every(isStageComplete);

  return (
    <div className="mt-8">
      <h2 className="text-center text-3xl font-bold text-primary">Your Life Stages</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Define how your savings change over time
      </p>
      <div className="mx-auto mt-8 max-w-5xl">
        <div className="max-h-[34rem] space-y-5 overflow-y-auto pr-2">
          {stages.map((stage) => (
            <StageCardEditor key={stage.id} stage={stage} onSave={handleSave} />
          ))}
        </div>
      </div>
      {error ? <p className="mt-4 text-center text-sm font-semibold text-red-600">{error}</p> : null}
      <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-3">
        <Button className="h-12 w-full rounded-full text-base" onClick={onNext} disabled={!canContinue}>
          Next
        </Button>
        <Button variant="outline" className="h-12 w-full rounded-full text-base" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
