"use client";

import FinancialProfileFields from "@/components/common/FinancialProfileFields";
import type { SelectOption } from "@/utils/referenceOptions";
import type { Allocation, FinancialData, Habits } from "@/utils/types";

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
  onProfileChange: (field: "estimatedLE" | "savings" | "currency" | "desiredLE", value: string) => void;
  onAllocationChange: (period: "before" | "after", key: keyof Allocation, value: string) => void;
  onHabitChange: (key: keyof Habits, value: string) => void;
  onSaveProfile: () => void;
  onSaveAllocations: () => void;
  onSaveHabits: () => void;
  canSaveProfile?: boolean;
  canSaveAllocations?: boolean;
  canSaveHabits?: boolean;
}

const HABIT_LABELS: Record<keyof Habits, string> = {
  smoking: "Smoking",
  physical: "Physical Activity",
  diet: "Healthy Diet",
  alcohol: "Alcohol Consumption",
};

export default function FinancialForm({
  profile,
  allocation,
  habits,
  currencyOptions,
  habitOptions,
  onProfileChange,
  onAllocationChange,
  onHabitChange,
  onSaveProfile,
  onSaveAllocations,
  onSaveHabits,
  canSaveProfile,
  canSaveAllocations,
  canSaveHabits,
}: FinancialFormProps) {
  return (
    <FinancialProfileFields
      profile={{
        estimatedLifeExpectancy: profile.estimatedLE,
        desiredLifeExpectancy: profile.desiredLE,
        currentSavings: profile.savings,
        preferredCurrency: profile.currency,
      }}
      allocations={allocation}
      habits={(Object.keys(habits) as Array<keyof Habits>).map((habit) => ({
        key: habit,
        label: HABIT_LABELS[habit],
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
      onSaveProfile={onSaveProfile}
      onSaveAllocations={onSaveAllocations}
      onSaveHabits={onSaveHabits}
      canSaveProfile={canSaveProfile}
      canSaveAllocations={canSaveAllocations}
      canSaveHabits={canSaveHabits}
    />
  );
}
