"use client";

import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import StageEditorCard, { type StageEditorValue } from "@/components/common/StageEditorCard";
import type { StageItem } from "@/types/onboarding";
import { isStageComplete } from "@/utils/onboardingValidators";

interface Step3StagesCardsProps {
  stages: StageItem[];
  error: string;
  onBack: () => void;
  onNext: () => void;
  onChange: (stages: StageItem[]) => void;
}

function toStageEditorValue(stage: StageItem): StageEditorValue {
  return {
    ageStart: stage.ageStart,
    ageEnd: stage.ageEnd,
    annualSaving: stage.annualSaving,
    currency: stage.currency,
    annualRate: stage.annualRate,
  };
}

function fromStageEditorValue(stage: StageItem, next: StageEditorValue): StageItem {
  return {
    ...stage,
    ageStart: next.ageStart,
    ageEnd: next.ageEnd,
    annualSaving: next.annualSaving,
    currency: next.currency,
    annualRate: next.annualRate,
  };
}

export default function Step3StagesCards({
  stages,
  error,
  onBack,
  onNext,
  onChange,
}: Step3StagesCardsProps) {
  const [draftStages, setDraftStages] = useState(stages);

  useEffect(() => {
    setDraftStages(stages);
  }, [stages]);

  function handleStageChange(index: number, next: StageEditorValue) {
    setDraftStages((prev) =>
      prev.map((stage, currentIndex) => (currentIndex === index ? fromStageEditorValue(stage, next) : stage))
    );
  }

  function handleBackClick() {
    onChange(draftStages);
    onBack();
  }

  function handleNextClick() {
    onChange(draftStages);
    onNext();
  }

  const canContinue = draftStages.length > 0 && draftStages.every(isStageComplete);

  return (
    <div className="mt-8">
      <h2 className="text-center text-3xl font-bold text-primary">Your Life Stages</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Define how your savings change over time
      </p>
      <div className="mx-auto mt-8 max-w-5xl">
        <div className="max-h-[34rem] space-y-5 overflow-y-auto pr-2">
          {draftStages.map((stage, index) => (
            <StageEditorCard
              key={stage.id}
              variant="register"
              index={index}
              stage={toStageEditorValue(stage)}
              onChange={(next) => handleStageChange(index, next)}
            />
          ))}
        </div>
      </div>
      {error ? <p className="mt-4 text-center text-sm font-semibold text-red-600">{error}</p> : null}
      <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-3">
        <Button className="h-12 w-full rounded-full text-base" onClick={handleNextClick} disabled={!canContinue}>
          Next
        </Button>
        <Button variant="outline" className="h-12 w-full rounded-full text-base" onClick={handleBackClick}>
          Back
        </Button>
      </div>
    </div>
  );
}
