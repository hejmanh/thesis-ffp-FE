"use client";

import FormField from "@/components/common/FormField";
import { useLifeExpectancyOptions } from "@/hooks/scenario/useLifeExpectancyOptions";

interface LifeExpectancyFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function LifeExpectancyField({
  value,
  onChange,
  disabled = false,
}: LifeExpectancyFieldProps) {
  const { options, isReady, isLoading } = useLifeExpectancyOptions();

  return (
    <FormField
      label="Life Expectancy"
      variant="select"
      isRequired
      placeholder={isLoading ? "Loading…" : "Select life expectancy"}
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled || !isReady || isLoading}
      hint={
          <>
        Select either your <strong>estimated life expectancy</strong>,
        calculated from your country, gender, and lifestyle habits, or your{" "}
        <strong>desired target lifespan</strong>.
      </>
      }
    />
  );
}
