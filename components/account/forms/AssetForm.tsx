"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import FormField from "@/components/common/FormField";
import type { Asset } from "@/utils/types";
import { ASSET_TYPES, CURRENCY_OPTIONS } from "@/utils/onboardingConstants";

interface AssetFormProps {
  asset: Asset;
  index: number;
  onChange: (next: Asset) => void;
  onRemove: () => void;
}

function isAssetComplete(asset: Asset): boolean {
  return Boolean(asset.name && asset.amount && asset.currency && asset.type && asset.growthRate);
}

export default function AssetForm({ asset, index, onChange, onRemove }: AssetFormProps) {
  const [draft, setDraft] = useState(asset);
  const [editing, setEditing] = useState(!isAssetComplete(asset));

  function updateField<K extends keyof Asset>(key: K, value: Asset[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    onChange(draft);
    setEditing(false);
  }

  if (!editing && isAssetComplete(asset)) {
    return (
      <div className="rounded-xl border border-border bg-white p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900">Asset #{index + 1}: {asset.name}</h4>
          <button
            type="button"
            className="text-sm font-semibold text-primary"
            onClick={() => {
              setDraft(asset);
              setEditing(true);
            }}
          >
            Edit
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <p>Amount: {asset.amount}</p>
          <p>Currency: {asset.currency}</p>
          <p>Type: {asset.type}</p>
          <p>Growth Rate: {asset.growthRate}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900">Asset #{index + 1}</h4>
        <Button variant="ghost" size="sm" className="text-red-600" onClick={onRemove}>
          Remove
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Name"
          className="sm:col-span-2"
          inputClassName="h-11"
          placeholder="Asset name"
          inputProps={{
            value: draft.name,
            onChange: (event) => updateField("name", event.target.value),
            autoComplete: "off",
          }}
        />
        <FormField
          label="Amount"
          inputClassName="h-11"
          placeholder="Amount"
          inputProps={{
            value: draft.amount,
            onChange: (event) => updateField("amount", event.target.value),
            autoComplete: "off",
          }}
        />
        <FormField
          label="Currency"
          variant="select"
          placeholder="Select currency"
          selectClassName="h-11"
          value={draft.currency}
          onChange={(value) => updateField("currency", value)}
          options={CURRENCY_OPTIONS.map((currency) => ({ label: currency, value: currency }))}
        />
        <FormField
          label="Type"
          variant="select"
          placeholder="Select type"
          selectClassName="h-11"
          value={draft.type}
          onChange={(value) => updateField("type", value)}
          options={ASSET_TYPES.map((type) => ({ label: type, value: type }))}
        />
        <FormField
          label="Growth Rate (%)"
          inputClassName="h-11"
          placeholder="Growth rate"
          inputProps={{
            value: draft.growthRate,
            onChange: (event) => updateField("growthRate", event.target.value),
            autoComplete: "off",
          }}
        />
      </div>
      <div className="mt-4 flex items-center justify-end">
        <Button size="sm" onClick={handleSave} disabled={!isAssetComplete(draft)}>
          Save
        </Button>
      </div>
    </div>
  );
}
