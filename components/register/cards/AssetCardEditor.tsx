"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import FormField from "@/components/common/FormField";
import type { AssetItem } from "@/types/onboarding";
import { ASSET_TYPES, CURRENCY_OPTIONS } from "@/utils/onboardingConstants";
import { isAssetComplete } from "@/utils/onboardingValidators";

interface AssetCardEditorProps {
  asset: AssetItem;
  onSave: (asset: AssetItem) => void;
  onDelete: (assetId: string) => void;
}

export default function AssetCardEditor({ asset, onSave, onDelete }: AssetCardEditorProps) {
  const [draft, setDraft] = useState(asset);
  const [editing, setEditing] = useState(!isAssetComplete(asset));

  function updateField<K extends keyof AssetItem>(key: K, value: AssetItem[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    onSave(draft);
    setEditing(false);
  }

  if (!editing && isAssetComplete(asset)) {
    return (
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <h3 className="text-3xl font-semibold text-slate-900">{asset.name}</h3>
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
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <h3 className="text-3xl font-semibold text-slate-900">Asset</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="assetName"
          name="assetName"
          label="Name"
          className="sm:col-span-2"
          placeholder="Asset name"
          inputProps={{
            value: draft.name,
            onChange: (event) => updateField("name", event.target.value),
            autoComplete: "off",
          }}
        />
        <FormField
          id="assetAmount"
          name="assetAmount"
          label="Amount"
          placeholder="Amount"
          inputProps={{
            value: draft.amount,
            onChange: (event) => updateField("amount", event.target.value),
            autoComplete: "off",
          }}
        />
        <FormField
          id="assetCurrency"
          name="assetCurrency"
          label="Currency"
          variant="select"
          placeholder="Select currency"
          value={draft.currency}
          onChange={(value) => updateField("currency", value)}
          options={CURRENCY_OPTIONS.map((currency) => ({ label: currency, value: currency }))}
        />
        <FormField
          id="assetType"
          name="assetType"
          label="Type"
          variant="select"
          placeholder="Select type"
          value={draft.type}
          onChange={(value) => updateField("type", value)}
          options={ASSET_TYPES.map((type) => ({ label: type, value: type }))}
        />
        <FormField
          id="assetGrowthRate"
          name="assetGrowthRate"
          label="Growth Rate (%)"
          placeholder="Growth rate"
          inputProps={{
            value: draft.growthRate,
            onChange: (event) => updateField("growthRate", event.target.value),
            autoComplete: "off",
          }}
        />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <button type="button" className="text-sm font-semibold text-red-500" onClick={() => onDelete(asset.id)}>
          Delete
        </button>
        <Button onClick={handleSave} disabled={!isAssetComplete(draft)}>
          Save
        </Button>
      </div>
    </div>
  );
}
