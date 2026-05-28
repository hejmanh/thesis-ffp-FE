"use client";

import Button from "@/components/common/Button";
import FinancialProfileFields from "@/components/common/FinancialProfileFields";
import type { Step2PersonalData } from "@/types/onboarding";
import type { SelectOption } from "@/utils/referenceOptions";

interface Step2PersonalFormProps {
  data: Step2PersonalData;
  estimatedLifeExpectancy: string;
  currencyOptions: SelectOption[];
  smokingOptions: SelectOption[];
  physicalActivityOptions: SelectOption[];
  dietQualityOptions: SelectOption[];
  alcoholConsumptionOptions: SelectOption[];
  error: string;
  referenceError?: string | null;
  isReferenceLoading: boolean;
  canContinue?: boolean;
  isSubmitting: boolean;
  onBack?: () => void;
  onNext: () => void;
  onChange: (next: Step2PersonalData) => void;
}

const HABIT_LABELS: Record<keyof Step2PersonalData["habits"], string> = {
  smoke: "Smoking",
  physical: "Physical Activity",
  diet: "Healthy Diet",
  alcohol: "Alcohol Consumption",
};

export default function Step2PersonalForm({
  data,
  estimatedLifeExpectancy,
  currencyOptions,
  smokingOptions,
  physicalActivityOptions,
  dietQualityOptions,
  alcoholConsumptionOptions,
  error,
  referenceError,
  isReferenceLoading,
  canContinue = true,
  isSubmitting,
  onBack,
  onNext,
  onChange,
}: Step2PersonalFormProps) {
  function updateRoot<K extends keyof Step2PersonalData>(
    key: K,
    value: Step2PersonalData[K],
  ) {
    onChange({ ...data, [key]: value });
  }

  function updateAllocation(
    section: "beforeFfp" | "afterFfp",
    key: "u" | "mu" | "rf",
    value: string,
  ) {
    onChange({
      ...data,
      [section]: {
        ...data[section],
        [key]: value,
      },
    });
  }

  function updateHabit(key: keyof Step2PersonalData["habits"], value: string) {
    onChange({
      ...data,
      habits: {
        ...data.habits,
        [key]: value,
      },
    });
  }

  return (
    <div className="mt-8">
      <h2 className="text-center text-3xl font-bold text-primary">
        Personal Information
      </h2>
      <div className="mx-auto mt-8 max-w-4xl space-y-7">
        <FinancialProfileFields
          profile={{
            estimatedLifeExpectancy,
            desiredLifeExpectancy: data.desiredLifeExpectancy,
            currentSavings: data.currentSavings,
            preferredCurrency: data.preferredCurrency,
          }}
          allocations={{
            before: data.beforeFfp,
            after: data.afterFfp,
          }}
          habits={(
            Object.keys(data.habits) as Array<keyof Step2PersonalData["habits"]>
          ).map((habit) => ({
            key: habit,
            label: HABIT_LABELS[habit],
            value: data.habits[habit],
            options:
              habit === "smoke"
                ? smokingOptions
                : habit === "physical"
                  ? physicalActivityOptions
                  : habit === "diet"
                    ? dietQualityOptions
                    : alcoholConsumptionOptions,
          }))}
          currencyOptions={currencyOptions}
          disabledRootFields={{ estimatedLifeExpectancy: true }}
          onRootChange={(field, value) => {
            const fieldMap = {
              estimatedLifeExpectancy: "estimatedLifeExpectancy",
              desiredLifeExpectancy: "desiredLifeExpectancy",
              currentSavings: "currentSavings",
              preferredCurrency: "preferredCurrency",
            } as const;
            updateRoot(fieldMap[field], value);
          }}
          onAllocationChange={(period, key, value) =>
            updateAllocation(period === "before" ? "beforeFfp" : "afterFfp", key, value)
          }
          onHabitChange={updateHabit}
          idPrefix="step2_"
          cardClassName="rounded-2xl border border-border bg-slate-50 p-5"
          titleClassName="text-lg font-semibold text-slate-900"
          fieldLabels={{
            estimatedLifeExpectancy: "Estimated Life Expectancy",
            desiredLifeExpectancy: "Desired Life Expectancy",
            preferredCurrency: "Preferred Currency",
          }}
          currentSavingsPlaceholder="Current savings amount"
        />
      </div>
      {isReferenceLoading ? (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Loading onboarding references...
        </p>
      ) : null}
      {referenceError ? (
        <p className="mt-4 text-center text-sm font-semibold text-red-600">
          {referenceError}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 text-center text-sm font-semibold text-red-600">
          {error}
        </p>
      ) : null}
      <div className="mx-auto mt-8 flex max-w-4xl gap-3">
        {onBack ? (
          <Button
            variant="outline"
            className="h-12 flex-1 rounded-full text-base"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Back
          </Button>
        ) : null}
        <Button
          className="h-12 flex-1 rounded-full text-base"
          onClick={onNext}
          disabled={
            isSubmitting ||
            isReferenceLoading ||
            !canContinue ||
            Boolean(referenceError)
          }
        >
          {isSubmitting ? "Saving..." : "Next"}
        </Button>
      </div>
    </div>
  );
}
