"use client";

import FinancialProfileFields from "@/components/common/FinancialProfileFields";
import StepNavigationActions from "@/components/register/steps/StepNavigationActions";
import type { Step2PersonalData } from "@/types/onboarding";
import type { SelectOption } from "@/utils/referenceOptions";
import { useTranslations } from "@/i18n/client";

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
  isSubmitting: boolean;
  onBack?: () => void;
  onNext: () => void;
  onChange: (next: Step2PersonalData) => void;
}

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
  isSubmitting,
  onBack,
  onNext,
  onChange,
}: Step2PersonalFormProps) {
  const fields = useTranslations("Fields");
  const financial = useTranslations("FinancialProfile");
  const register = useTranslations("Register.personal");
  const habitLabels: Record<keyof Step2PersonalData["habits"], string> = {
    smoke: financial("habits.smoking"),
    physical: financial("habits.physical"),
    diet: financial("habits.diet"),
    alcohol: financial("habits.alcohol"),
  };

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
      {/* <h2 className="text-center text-3xl font-bold text-primary">
        Personal Information
      </h2> */}
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
            label: habitLabels[habit],
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
          cardClassName="p-0"
          titleClassName="text-lg font-semibold text-slate-900"
          fieldLabels={{
            estimatedLifeExpectancy: fields("estimatedLifeExpectancy"),
            desiredLifeExpectancy: fields("desiredLifeExpectancy"),
            preferredCurrency: fields("preferredCurrency"),
          }}
          currentSavingsPlaceholder={fields("placeholderMoney")}
        />
      </div>
      {isReferenceLoading ? (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {register("loadingReferences")}
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
      <StepNavigationActions
        className="max-w-4xl"
        isSubmitting={isSubmitting}
        nextDisabled={isReferenceLoading || Boolean(referenceError)}
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  );
}
