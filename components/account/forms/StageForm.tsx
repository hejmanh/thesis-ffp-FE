"use client";

import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import FormField from "@/components/common/FormField";
import { CURRENCY_OPTIONS } from "@/utils/onboardingConstants";
import type { Stage } from "@/utils/types";

interface StageFormProps {
  stage: Stage;
  index: number;
  onChange: (next: Stage) => void;
}

function isStageComplete(stage: Stage): boolean {
  return Boolean(stage.startAge && stage.endAge && stage.annualSaving && stage.currency && stage.growthRate);
}

export default function StageForm({ stage, index, onChange }: StageFormProps) {
  const [draft, setDraft] = useState(stage);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setDraft(stage);
  }, [stage]);

  function updateField<K extends keyof Stage>(key: K, value: Stage[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    onChange(draft);
    setEditing(false);
  }

  function handleCancel() {
    setDraft(stage);
    setEditing(false);
  }

  function handleDelete() {
    const clearedStage: Stage = {
      ...stage,
      annualSaving: "",
      growthRate: "",
    };

    setDraft(clearedStage);
    onChange(clearedStage);
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="rounded-xl border border-border bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              Stage #{index + 1}: {stage.startAge} - {stage.endAge}
            </h4>
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
          <p>Growth Rate: {stage.growthRate ? `${stage.growthRate}%` : "-"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Stage #{index + 1}: {draft.startAge} - {draft.endAge}
          </h4>
        </div>
      </div>
      <div className="space-y-4">
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
          <FormField
            label="Currency"
            variant="select"
            selectClassName="h-11"
            value={draft.currency}
            onChange={(value) => updateField("currency", value)}
            options={CURRENCY_OPTIONS.map((c) => ({ label: c, value: c }))}
          />
        </div>
        <FormField
          label="Growth Rate"
          inputContainerClassName="w-20"
          inputClassName="h-11 px-2 pr-5"
          suffix="%"
          placeholder="8"
          inputProps={{
            value: draft.growthRate,
            onChange: (event) => updateField("growthRate", event.target.value),
            autoComplete: "off",
          }}
        />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-600 hover:bg-red-50">
          Delete
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!isStageComplete(draft)}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
