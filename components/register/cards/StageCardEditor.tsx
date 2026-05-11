"use client";

import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import FormField from "@/components/common/FormField";
import type { StageItem } from "@/types/onboarding";
import { isStageComplete } from "@/utils/onboardingValidators";

interface StageCardEditorProps {
  stage: StageItem;
  onSave: (stage: StageItem) => void;
}

export default function StageCardEditor({ stage, onSave }: StageCardEditorProps) {
  const [draft, setDraft] = useState(stage);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setDraft(stage);
  }, [stage]);

  function updateField<K extends keyof StageItem>(key: K, value: StageItem[K]) {
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
    const clearedStage: StageItem = {
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
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-3xl font-semibold text-slate-900">
              Stage {stage.ageStart} - {stage.ageEnd}
            </h3>
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
          <p>Annual Rate: {stage.annualRate ? `${stage.annualRate}%` : "-"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <h3 className="text-3xl font-semibold text-slate-900">
        Stage {draft.ageStart} - {draft.ageEnd}
      </h3>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            id="annualSaving"
            name="annualSaving"
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
            id="currencyDisplay"
            name="currencyDisplay"
            label="Currency"
            inputClassName="h-11"
            inputProps={{
              value: draft.currency,
              readOnly: true,
            }}
          />
        </div>
        <FormField
          id="annualRate"
          name="annualRate"
          label="Growth Rate"
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
      <div className="mt-5 flex items-center justify-between">
        <Button variant="ghost" onClick={handleDelete} className="text-red-600 hover:bg-red-50">
          Delete
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isStageComplete(draft)}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
