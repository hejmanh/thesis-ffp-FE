"use client";

import Button from "@/components/common/Button";
import StageCardEditor from "@/components/register/cards/StageCardEditor";
import type { StageItem } from "@/types/onboarding";
import { isStageComplete } from "@/utils/onboardingValidators";

interface Step3StagesCardsProps {
  stages: StageItem[];
  error: string;
  onBack: () => void;
  onNext: () => void;
  onChange: (stages: StageItem[]) => void;
}

function makeEmptyStage(): StageItem {
  return {
    id: crypto.randomUUID(),
    ageStart: "",
    ageEnd: "",
    annualSaving: "",
    currency: "",
    annualRate: "",
  };
}

export default function Step3StagesCards({
  stages,
  error,
  onBack,
  onNext,
  onChange,
}: Step3StagesCardsProps) {
  function handleSave(updated: StageItem) {
    onChange(stages.map((stage) => (stage.id === updated.id ? updated : stage)));
  }

  function handleDelete(stageId: string) {
    onChange(stages.filter((stage) => stage.id !== stageId));
  }

  function handleAddStage() {
    onChange([...stages, makeEmptyStage()]);
  }

  const canContinue = stages.length > 0 && stages.every(isStageComplete);

  return (
    <div className="mt-8">
      <h2 className="text-center text-4xl font-bold text-primary">Your Life Stages</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Define how your savings change over time
      </p>
      <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-5">
        {stages.map((stage) => (
          <StageCardEditor key={stage.id} stage={stage} onSave={handleSave} onDelete={handleDelete} />
        ))}
      </div>
      <div className="mx-auto mt-5 max-w-5xl">
        <button type="button" onClick={handleAddStage} className="text-sm font-semibold text-primary">
          + Add another stage
        </button>
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
