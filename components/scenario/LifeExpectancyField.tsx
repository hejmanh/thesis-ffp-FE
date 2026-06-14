"use client";

import FormField from "@/components/common/FormField";
import { useLifeExpectancyOptions } from "@/hooks/scenario/useLifeExpectancyOptions";
import { useTranslations } from "@/i18n/client";

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
  const fields = useTranslations("Fields");
  const common = useTranslations("Common");
  const scenario = useTranslations("Scenario");
  const { options, isReady, isLoading } = useLifeExpectancyOptions();

  return (
    <FormField
      label={fields("lifeExpectancy")}
      variant="select"
      isRequired
      placeholder={isLoading ? common("loading") : fields("selectLifeExpectancy")}
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled || !isReady || isLoading}
      hint={
          <>
        {scenario("lifeExpectancyHint")}
      </>
      }
    />
  );
}
