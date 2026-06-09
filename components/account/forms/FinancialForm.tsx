"use client";

import Button from "@/components/common/Button";
import FinancialProfileFields from "@/components/common/FinancialProfileFields";
import type { SelectOption } from "@/utils/referenceOptions";
import type { Allocation, FinancialData, Habits } from "@/utils/types";
import { useTranslations } from "@/i18n/client";

interface FinancialFormProps {
  profile: {
    estimatedLE: string;
    desiredLE: string;
    savings: string;
    currency: string;
  };
  allocation: FinancialData["allocation"];
  habits: Habits;
  currencyOptions: SelectOption[];
  habitOptions: Record<keyof Habits, SelectOption[]>;
  canSave: boolean;
  isSaving: boolean;
  onSave: () => void;
  onProfileChange: (
    field: "estimatedLE" | "savings" | "currency" | "desiredLE",
    value: string,
  ) => void;
  onAllocationChange: (
    period: "before" | "after",
    key: keyof Allocation,
    value: string,
  ) => void;
  onHabitChange: (key: keyof Habits, value: string) => void;
}

const HABIT_ORDER: Array<keyof Habits> = [
  "physical",
  "diet",
  "smoking",
  "alcohol",
];

export default function FinancialForm({
  profile,
  allocation,
  habits,
  currencyOptions,
  habitOptions,
  canSave,
  isSaving,
  onSave,
  onProfileChange,
  onAllocationChange,
  onHabitChange,
}: FinancialFormProps) {
  const financial = useTranslations("FinancialProfile");
  const common = useTranslations("Common");
  const habitLabels: Record<keyof Habits, string> = {
    smoking: financial("habits.smoking"),
    physical: financial("habits.physical"),
    diet: financial("habits.diet"),
    alcohol: financial("habits.alcohol"),
  };

  return (
    <FinancialProfileFields
        profile={{
          estimatedLifeExpectancy: profile.estimatedLE,
          desiredLifeExpectancy: profile.desiredLE,
          currentSavings: profile.savings,
          preferredCurrency: profile.currency,
        }}
        allocations={allocation}
        habits={HABIT_ORDER.map((habit) => ({
          key: habit,
          label: habitLabels[habit],
          value: habits[habit],
          options: habitOptions[habit],
        }))}
        currencyOptions={currencyOptions}
        disabledRootFields={{ estimatedLifeExpectancy: true }}
        onRootChange={(field, value) => {
          const fieldMap = {
            estimatedLifeExpectancy: "estimatedLE",
            desiredLifeExpectancy: "desiredLE",
            currentSavings: "savings",
            preferredCurrency: "currency",
          } as const;
          onProfileChange(fieldMap[field], value);
        }}
        onAllocationChange={onAllocationChange}
        onHabitChange={onHabitChange}
        footer={
          <div className="mt-4 flex justify-end">
            <Button size="sm" onClick={onSave} disabled={!canSave}>
              {isSaving ? common("saving") : common("saveChanges")}
            </Button>
          </div>
        }
      />
  );
}
