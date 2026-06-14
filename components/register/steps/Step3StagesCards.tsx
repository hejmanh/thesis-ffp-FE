"use client";

import { useEnterToFocusNextField } from "@/components/common/useEnterToFocusNextField";
import StageEditorCard, {
  type StageEditorValue,
} from "@/components/common/StageEditorCard";
import StepNavigationActions from "@/components/register/steps/StepNavigationActions";
import type { StageItem } from "@/types/onboarding";
import { isStageComplete } from "@/utils/onboardingValidators";
import { useTranslations } from "@/i18n/client";

interface Step3StagesCardsProps {
  stages: StageItem[];
  error: string;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onChange: (stages: StageItem[]) => void;
}

function toStageEditorValue(stage: StageItem): StageEditorValue {
  return {
    title: stage.title || `Stage ${stage.stageNo}`,
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
    annualSaving: next.annualSaving,
    annualRate: next.annualRate,
  };
}

export default function Step3StagesCards({
  stages,
  error,
  isSubmitting,
  onBack,
  onNext,
  onChange,
}: Step3StagesCardsProps) {
  const t = useTranslations("Register.stages");
  const { containerRef, handleEnterKeyDown } = useEnterToFocusNextField();
  const canContinue = stages.length > 0 && stages.every(isStageComplete);

  return (
    <div
      ref={containerRef}
      className="mt-8"
      onKeyDown={handleEnterKeyDown}
    >
      {/* <h2 className="text-center text-3xl font-bold text-primary">
        Your Life Stages
      </h2> */}
      <p className="mt-2 text-center text-sm text-muted-foreground">
        {t("description")}
      </p>
      <div className="mx-auto mt-8 max-w-5xl">
        <div className="max-h-[34rem] space-y-5 overflow-y-auto pr-2">
          {stages.map((stage, index) => (
            <StageEditorCard
              key={stage.id}
              variant="register"
              index={index}
              stage={toStageEditorValue(stage)}
              onChange={(next) =>
                onChange(
                  stages.map((currentStage) =>
                    currentStage.id === stage.id
                      ? fromStageEditorValue(stage, next)
                      : currentStage,
                  ),
                )
              }
            />
          ))}
        </div>
      </div>
      {error ? (
        <p className="mt-4 text-center text-sm font-semibold text-red-600">
          {error}
        </p>
      ) : null}
      <StepNavigationActions
        className="max-w-5xl"
        layout="column"
        isSubmitting={isSubmitting}
        nextDisabled={!canContinue}
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  );
}
