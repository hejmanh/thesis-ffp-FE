"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import FormField from "@/components/common/FormField";
import type { Stage } from "@/utils/types";
import { CURRENCY_OPTIONS } from "@/utils/onboardingConstants";

interface StageFormProps {
  stage: Stage;
  index: number;
  onChange: (next: Stage) => void;
  onRemove: () => void;
}

function isStageComplete(stage: Stage): boolean {
  return Boolean(stage.startAge && stage.endAge && stage.annualSaving && stage.currency && stage.growthRate);
}

export default function StageForm({ stage, index, onChange, onRemove }: StageFormProps) {
  const [draft, setDraft] = useState(stage);
  const [editing, setEditing] = useState(!isStageComplete(stage));

  function updateField<K extends keyof Stage>(key: K, value: Stage[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    onChange(draft);
    setEditing(false);
  }

  if (!editing && isStageComplete(stage)) {
    return (
      <div className="rounded-xl border border-border bg-white p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900">
            Stage #{index + 1}: {stage.startAge} - {stage.endAge}
          </h4>
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
          <p>Annual Saving: {stage.annualSaving}</p>
          <p>Currency: {stage.currency}</p>
          <p>Growth Rate: {stage.growthRate}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900">Stage #{index + 1}</h4>
        <Button variant="ghost" size="sm" className="text-red-600" onClick={onRemove}>
          Remove
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Start Age"
          inputClassName="h-11"
          placeholder="25"
          inputProps={{
            value: draft.startAge,
            onChange: (event) => updateField("startAge", event.target.value),
            autoComplete: "off",
          }}
        />
        <FormField
          label="End Age"
          inputClassName="h-11"
          placeholder="35"
          inputProps={{
            value: draft.endAge,
            onChange: (event) => updateField("endAge", event.target.value),
            autoComplete: "off",
          }}
        />
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
        <FormField
          label="Currency"
          variant="select"
          selectClassName="h-11"
          placeholder="Select currency"
          value={draft.currency}
          onChange={(value) => updateField("currency", value)}
          options={CURRENCY_OPTIONS.map((currency) => ({ label: currency, value: currency }))}
        />
        <FormField
          label="Growth Rate (%)"
          inputClassName="h-11"
          placeholder="8"
          inputProps={{
            value: draft.growthRate,
            onChange: (event) => updateField("growthRate", event.target.value),
            autoComplete: "off",
          }}
        />
      </div>
      <div className="mt-4 flex items-center justify-end">
        <Button size="sm" onClick={handleSave} disabled={!isStageComplete(draft)}>
          Save
        </Button>
      </div>
    </div>
  );
}
