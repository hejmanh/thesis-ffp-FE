"use client";

import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import FormField from "@/components/common/FormField";
import { CURRENCY_OPTIONS } from "@/utils/onboardingConstants";

export interface StageEditorValue {
  ageStart: string;
  ageEnd: string;
  annualSaving: string;
  currency: string;
  annualRate: string;
}

interface StageEditorCardProps {
  stage: StageEditorValue;
  onSave: (stage: StageEditorValue) => void;
  variant: "account" | "register";
  index?: number;
}

function isStageComplete(stage: StageEditorValue): boolean {
  return Boolean(stage.ageStart && stage.ageEnd && stage.annualSaving && stage.currency && stage.annualRate);
}

function formatStageTitle(stage: StageEditorValue, index?: number): string {
  return `Stage ${(index ?? 0) + 1} [${stage.ageStart} - ${stage.ageEnd}]`;
}

const variantConfig = {
  account: {
    containerClassName: "rounded-xl border border-border bg-white p-4",
    headerClassName: "text-sm font-semibold text-slate-900",
    actionRowClassName: "mt-4 flex items-center justify-between",
    deleteButtonClassName: "text-red-600 hover:bg-red-50",
    title: formatStageTitle,
    displayRateLabel: "Growth Rate",
    inputRateLabel: "Growth Rate",
    currencyField: "select" as const,
    buttonSize: "sm" as const,
  },
  register: {
    containerClassName: "rounded-2xl border border-border bg-white p-5 shadow-sm",
    headerClassName: "text-xl font-semibold text-slate-900",
    actionRowClassName: "mt-5 flex items-center justify-between",
    deleteButtonClassName: "text-red-600 hover:bg-red-50",
    title: formatStageTitle,
    displayRateLabel: "Annual Rate",
    inputRateLabel: "Growth Rate",
    currencyField: "readonly" as const,
    buttonSize: "md" as const,
  },
};

export default function StageEditorCard({ stage, onSave, variant, index }: StageEditorCardProps) {
  const [draft, setDraft] = useState(stage);
  const [editing, setEditing] = useState(false);
  const config = variantConfig[variant];

  useEffect(() => {
    setDraft(stage);
  }, [stage]);

  function updateField<K extends keyof StageEditorValue>(key: K, value: StageEditorValue[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    onSave(draft);
    setEditing(false);
  }

  function handleCancel() {
    setDraft(stage);
    setEditing(false);
  }

  function handleDelete() {
    const clearedStage: StageEditorValue = {
      ...stage,
      annualSaving: "",
      annualRate: "",
    };

    setDraft(clearedStage);
    onSave(clearedStage);
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className={config.containerClassName}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className={config.headerClassName}>{config.title(stage, index)}</h3>
          </div>
          <button
            type="button"
            className="text-sm font-semibold text-primary"
            onClick={() => {
              setDraft(stage);
              setEditing(true);
            }}
          >
            Edit
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <p>Annual Saving: {stage.annualSaving || "-"}</p>
          <p>Currency: {stage.currency}</p>
          <p>
            {config.displayRateLabel}: {stage.annualRate ? `${stage.annualRate}%` : "-"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={config.containerClassName}>
      <h3 className={config.headerClassName}>{config.title(draft, index)}</h3>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Annual Saving"
            inputClassName="h-11"
            placeholder="Enter annual saving"
            inputProps={{
              value: draft.annualSaving,
              onChange: (event) => updateField("annualSaving", event.target.value),
              autoComplete: "off",
            }}
          />
          {config.currencyField === "select" ? (
            <FormField
              label="Currency"
              variant="select"
              selectClassName="h-11"
              value={draft.currency}
              onChange={(value) => updateField("currency", value)}
              options={CURRENCY_OPTIONS.map((currency) => ({ label: currency, value: currency }))}
            />
          ) : (
            <FormField
              label="Currency"
              inputClassName="h-11"
              inputProps={{
                value: draft.currency,
                readOnly: true,
              }}
            />
          )}
        </div>
        <FormField
          label={config.inputRateLabel}
          inputContainerClassName="w-20"
          inputClassName="h-11 px-2 pr-5"
          suffix="%"
          placeholder="8"
          inputProps={{
            value: draft.annualRate,
            onChange: (event) => updateField("annualRate", event.target.value),
            autoComplete: "off",
          }}
        />
      </div>
      <div className={config.actionRowClassName}>
        <Button
          variant="ghost"
          size={config.buttonSize}
          onClick={handleDelete}
          className={config.deleteButtonClassName}
        >
          Delete
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size={config.buttonSize} onClick={handleCancel}>
            Cancel
          </Button>
          <Button size={config.buttonSize} onClick={handleSave} disabled={!isStageComplete(draft)}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
