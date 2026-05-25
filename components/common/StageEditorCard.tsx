"use client";

import FormField from "@/components/common/FormField";

export interface StageEditorValue {
  title?: string;
  ageStart: string;
  ageEnd: string;
  annualSaving: string;
  currency: string;
  annualRate: string;
}

interface StageEditorCardProps {
  stage: StageEditorValue;
  onChange: (stage: StageEditorValue) => void;
  variant: "account" | "register";
  index?: number;
}

function formatStageTitle(stage: StageEditorValue, index?: number): string {
  if (stage.title) {
    return stage.title;
  }
  return `Stage ${(index ?? 0) + 1}: Age ${stage.ageStart} - ${stage.ageEnd}`;
}

const variantConfig = {
  account: {
    containerClassName: "rounded-xl border border-border bg-white p-4",
    headerClassName: "text-sm font-semibold text-slate-900",
    inputRateLabel: "Annual Rate",
  },
  register: {
    containerClassName:
      "rounded-2xl border border-border bg-white p-5 shadow-sm",
    headerClassName: "text-xl font-semibold text-slate-900",
    inputRateLabel: "Annual Growth Rate",
  },
};

export default function StageEditorCard({
  stage,
  onChange,
  variant,
  index,
}: StageEditorCardProps) {
  const config = variantConfig[variant];

  function updateField<K extends keyof StageEditorValue>(
    key: K,
    value: StageEditorValue[K],
  ) {
    onChange({ ...stage, [key]: value });
  }

  return (
    <div className={config.containerClassName}>
      <h3 className={config.headerClassName}>
        {formatStageTitle(stage, index)}
      </h3>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Initial Annual Savings"
          inputClassName="h-11 px-3 pr-14"
          suffix={stage.currency}
          placeholder="e.g. 100000"
          inputProps={{
            value: stage.annualSaving,
            onChange: (event) =>
              updateField("annualSaving", event.target.value),
            autoComplete: "off",
          }}
        />
        <FormField
          label={config.inputRateLabel}
          inputClassName="h-11 px-3 pr-8"
          suffix="%"
          placeholder="e.g. 15"
          inputProps={{
            value: stage.annualRate,
            onChange: (event) => updateField("annualRate", event.target.value),
            type: "number",
            min: 0,
            max: 100,
            step: "1",
            autoComplete: "off",
          }}
        />
      </div>
    </div>
  );
}
