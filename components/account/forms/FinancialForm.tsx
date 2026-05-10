"use client";

import FinancialProfileFields from "@/components/common/FinancialProfileFields";
import type { Allocation, FinancialData, Habits } from "@/utils/types";

interface FinancialFormProps {
  data: FinancialData;
  onRootChange: (field: "estimatedLE" | "savings" | "currency" | "desiredLE", value: string) => void;
  onAllocationChange: (period: "before" | "after", key: keyof Allocation, value: string) => void;
  onHabitChange: (key: keyof Habits, value: string) => void;
}

const HABIT_LABELS: Record<keyof Habits, string> = {
  smoking: "Smoking",
  physical: "Physical Activity",
  diet: "Healthy Diet",
  alcohol: "Alcohol Consumption",
};

export default function FinancialForm({
  data,
  onRootChange,
  onAllocationChange,
  onHabitChange,
}: FinancialFormProps) {
  return (
    <FinancialProfileFields
      profile={{
        estimatedLifeExpectancy: data.estimatedLE,
        desiredLifeExpectancy: data.desiredLE,
        currentSavings: data.savings,
        preferredCurrency: data.currency,
      }}
      allocations={data.allocation}
      habits={(Object.keys(data.habits) as Array<keyof Habits>).map((habit) => ({
        key: habit,
        label: HABIT_LABELS[habit],
        value: data.habits[habit],
      }))}
      onRootChange={(field, value) => {
        const fieldMap = {
          estimatedLifeExpectancy: "estimatedLE",
          desiredLifeExpectancy: "desiredLE",
          currentSavings: "savings",
          preferredCurrency: "currency",
        } as const;
        onRootChange(fieldMap[field], value);
      }}
      onAllocationChange={onAllocationChange}
      onHabitChange={onHabitChange}
    />
  );
}
