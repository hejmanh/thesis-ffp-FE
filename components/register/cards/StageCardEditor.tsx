"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import FormField from "@/components/common/FormField";
import type { StageItem } from "@/types/onboarding";
import { CURRENCY_OPTIONS } from "@/utils/onboardingConstants";
import { isStageComplete } from "@/utils/onboardingValidators";

interface StageCardEditorProps {
  stage: StageItem;
  onSave: (stage: StageItem) => void;
  onDelete: (stageId: string) => void;
}

export default function StageCardEditor({ stage, onSave, onDelete }: StageCardEditorProps) {
  const [draft, setDraft] = useState(stage);
  const [editing, setEditing] = useState(!isStageComplete(stage));

  function updateField<K extends keyof StageItem>(key: K, value: StageItem[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    onSave(draft);
    setEditing(false);
  }

  if (!editing && isStageComplete(stage)) {
    return (
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <h3 className="text-3xl font-semibold text-slate-900">
            Stage {stage.ageStart} - {stage.ageEnd}
          </h3>
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
          <p>Annual Rate: {stage.annualRate}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <h3 className="text-3xl font-semibold text-slate-900">Stage</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Age Start"
          placeholder="25"
          inputProps={{
            value: draft.ageStart,
            onChange: (event) => updateField("ageStart", event.target.value),
          }}
        />
        <FormField
          label="Age End"
          placeholder="35"
          inputProps={{
            value: draft.ageEnd,
            onChange: (event) => updateField("ageEnd", event.target.value),
          }}
        />
        <FormField
          label="Annual Saving"
          className="sm:col-span-2"
          placeholder="Enter annual saving"
          inputProps={{
            value: draft.annualSaving,
            onChange: (event) => updateField("annualSaving", event.target.value),
          }}
        />
        <FormField
          label="Currency"
          variant="select"
          placeholder="Select currency"
          selectProps={{
            value: draft.currency,
            onChange: (event) => updateField("currency", event.target.value),
          }}
          options={CURRENCY_OPTIONS.map((currency) => ({ label: currency, value: currency }))}
        />
        <FormField
          label="Annual Rate (%)"
          placeholder="8"
          inputProps={{
            value: draft.annualRate,
            onChange: (event) => updateField("annualRate", event.target.value),
          }}
        />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <button type="button" className="text-sm font-semibold text-red-500" onClick={() => onDelete(stage.id)}>
          Delete
        </button>
        <Button onClick={handleSave} disabled={!isStageComplete(draft)}>
          Save
        </Button>
      </div>
    </div>
  );
}
