"use client";

import FormField from "@/components/common/FormField";
import type { Allocation, FinancialData, Habits } from "@/utils/types";
import { CURRENCY_OPTIONS, HABIT_LEVELS } from "@/utils/onboardingConstants";

interface FinancialFormProps {
  data: FinancialData;
  onRootChange: (field: "savings" | "currency" | "desiredLE", value: string) => void;
  onAllocationChange: (period: "before" | "after", key: keyof Allocation, value: string) => void;
  onHabitChange: (key: keyof Habits, value: string) => void;
}

const HABIT_LABELS: Record<keyof Habits, string> = {
  smoking: "Smoking",
  physical: "Physical Activity",
  diet: "Healthy Diet",
  alcohol: "Alcohol Consumption",
};

const ALLOCATION_LABELS: Record<keyof Allocation, { description: string; symbol: string }> = {
  u: { description: "Proportion of risky asset", symbol: "u" },
  mu: { description: "Expected annual return rate of risky asset", symbol: "μ" },
  rf: { description: "Risk-free annual return rate", symbol: "r_f" },
};

const ALLOCATION_HINTS = {
  before:
    "Used for savings and investments only. Rental income and other income sources are already included in life-stage savings.",
  after:
    "Used for remaining savings after retirement. Rental income and pension are handled separately.",
} as const;

export default function FinancialForm({
  data,
  onRootChange,
  onAllocationChange,
  onHabitChange,
}: FinancialFormProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-slate-50 p-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Current Savings"
          className="sm:col-span-2"
          inputClassName="h-11"
          placeholder="100000"
          inputProps={{
            value: data.savings,
            onChange: (event) => onRootChange("savings", event.target.value),
            autoComplete: "off",
          }}
        />
        <FormField
          label="Currency"
          variant="select"
          selectClassName="h-11"
          value={data.currency}
          onChange={(value) => onRootChange("currency", value)}
          options={CURRENCY_OPTIONS.map((currency) => ({ label: currency, value: currency }))}
        />
        <FormField
          label="Desired LE"
          inputClassName="h-11"
          placeholder="90"
          inputProps={{
            value: data.desiredLE,
            onChange: (event) => onRootChange("desiredLE", event.target.value),
            autoComplete: "off",
          }}
        />
      </div>

      {(["before", "after"] as const).map((period) => (
        <div key={period} className="rounded-xl border border-border bg-slate-50 p-4">
          <h3 className="text-base font-semibold text-slate-900">
            Asset Allocation {period === "before" ? "Before FFP" : "After FFP"}
          </h3>
          <p className="mt-1 text-xs italic text-slate-600">{ALLOCATION_HINTS[period]}</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {(["u", "mu", "rf"] as const).map((key) => (
              <div key={`${period}_${key}`} className="grid h-full grid-rows-[1fr_auto] gap-2">
                <div>
                  <p className="text-sm text-slate-700">{ALLOCATION_LABELS[key].description}</p>
                  <p className="text-xs italic text-slate-500">{ALLOCATION_LABELS[key].symbol}</p>
                </div>
                <FormField
                  label=""
                  inputContainerClassName="w-16"
                  inputClassName="h-11"
                  suffix="%"
                  inputProps={{
                    value: data.allocation[period][key],
                    onChange: (event) => onAllocationChange(period, key, event.target.value),
                    autoComplete: "off",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-xl border border-border bg-slate-50 p-4">
        <h3 className="text-base font-semibold text-slate-900">Habits</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(Object.keys(data.habits) as Array<keyof Habits>).map((habit) => (
            <div
              key={habit}
            >
              <FormField
                label={HABIT_LABELS[habit]}
                variant="select"
                selectClassName="h-11"
                placeholder="Select level"
                value={data.habits[habit]}
                onChange={(value) => onHabitChange(habit, value)}
                options={HABIT_LEVELS.map((item) => ({ label: item, value: item }))}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
