"use client";

import Button from "@/components/common/Button";
import FormField from "@/components/common/FormField";
import type { Step2PersonalData } from "@/types/onboarding";
import { CURRENCY_OPTIONS, HABIT_LEVELS } from "@/utils/onboardingConstants";

interface Step2PersonalFormProps {
  data: Step2PersonalData;
  error: string;
  onBack?: () => void;
  onNext: () => void;
  onChange: (next: Step2PersonalData) => void;
}

export default function Step2PersonalForm({
  data,
  error,
  onBack,
  onNext,
  onChange,
}: Step2PersonalFormProps) {
  function updateRoot<K extends keyof Step2PersonalData>(key: K, value: Step2PersonalData[K]) {
    onChange({ ...data, [key]: value });
  }

  function updateAllocation(section: "beforeFfp" | "afterFfp", key: "u" | "mu" | "rf", value: string) {
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
      <h2 className="text-center text-3xl font-bold text-primary">Personal Information</h2>
      <div className="mx-auto mt-8 max-w-4xl space-y-7">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            id="currentSavings"
            name="currentSavings"
            label="Current Savings"
            className="sm:col-span-2"
            inputClassName="h-11"
            placeholder="Current savings amount"
            inputProps={{
              value: data.currentSavings,
              onChange: (event) => updateRoot("currentSavings", event.target.value),
              autoComplete: "off",
            }}
          />
          <FormField
            id="preferredCurrency"
            name="preferredCurrency"
            label="Preferred Currency"
            variant="select"
            selectClassName="h-11"
            value={data.preferredCurrency}
            onChange={(value) => updateRoot("preferredCurrency", value)}
            options={CURRENCY_OPTIONS.map((currency) => ({ label: currency, value: currency }))}
          />
          <FormField
            id="desiredLifeExpectancy"
            name="desiredLifeExpectancy"
            label="Desired Life Expectancy"
            inputClassName="h-11"
            placeholder="90"
            inputProps={{
              value: data.desiredLifeExpectancy,
              onChange: (event) => updateRoot("desiredLifeExpectancy", event.target.value),
              autoComplete: "off",
            }}
          />
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">Asset Allocation Before FFP</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {(["u", "mu", "rf"] as const).map((allocationKey) => (
              <FormField
                key={allocationKey}
                id={`beforeFfp_${allocationKey}`}
                name={`beforeFfp_${allocationKey}`}
                label={allocationKey.toUpperCase()}
                placeholder="%"
                inputProps={{
                  value: data.beforeFfp[allocationKey],
                  onChange: (event) => updateAllocation("beforeFfp", allocationKey, event.target.value),
                  autoComplete: "off",
                }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">Asset Allocation After FFP</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {(["u", "mu", "rf"] as const).map((allocationKey) => (
              <FormField
                key={allocationKey}
                id={`afterFfp_${allocationKey}`}
                name={`afterFfp_${allocationKey}`}
                label={allocationKey.toUpperCase()}
                placeholder="%"
                inputProps={{
                  value: data.afterFfp[allocationKey],
                  onChange: (event) => updateAllocation("afterFfp", allocationKey, event.target.value),
                  autoComplete: "off",
                }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">Habits</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(Object.keys(data.habits) as Array<keyof Step2PersonalData["habits"]>).map((habitKey) => (
              <FormField
                key={habitKey}
                id={`habit_${habitKey}`}
                name={`habit_${habitKey}`}
                label={habitKey.charAt(0).toUpperCase() + habitKey.slice(1)}
                variant="select"
                placeholder="Select level"
                value={data.habits[habitKey]}
                onChange={(value) => updateHabit(habitKey, value)}
                options={HABIT_LEVELS.map((habit) => ({ label: habit, value: habit }))}
              />
            ))}
          </div>
        </div>
      </div>
      {error ? <p className="mt-4 text-center text-sm font-semibold text-red-600">{error}</p> : null}
      <div className="mx-auto mt-8 flex max-w-4xl gap-3">
        {onBack ? (
          <Button variant="outline" className="h-12 flex-1 rounded-full text-base" onClick={onBack}>
            Back
          </Button>
        ) : null}
        <Button className="h-12 flex-1 rounded-full text-base" onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
