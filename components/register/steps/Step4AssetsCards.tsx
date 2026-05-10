"use client";

import Button from "@/components/common/Button";
import AssetCardEditor from "@/components/register/cards/AssetCardEditor";
import type { AssetItem } from "@/types/onboarding";
import { isAssetComplete } from "@/utils/onboardingValidators";

interface Step4AssetsCardsProps {
  assets: AssetItem[];
  error: string;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
  onChange: (assets: AssetItem[]) => void;
}

function makeEmptyAsset(): AssetItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    amount: "",
    currency: "",
    type: "",
    growthRate: "",
  };
}

export default function Step4AssetsCards({
  assets,
  error,
  isSubmitting,
  onBack,
  onSubmit,
  onChange,
}: Step4AssetsCardsProps) {
  function handleSave(updated: AssetItem) {
    onChange(assets.map((asset) => (asset.id === updated.id ? updated : asset)));
  }

  function handleDelete(assetId: string) {
    onChange(assets.filter((asset) => asset.id !== assetId));
  }

  function handleAddAsset() {
    onChange([...assets, makeEmptyAsset()]);
  }

  const canSubmit = assets.length > 0 && assets.every(isAssetComplete);

  return (
    <div className="mt-8">
      <h2 className="text-center text-3xl font-bold text-primary">Asset Data</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Add and organize your assets with growth assumptions
      </p>
      <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-5">
        {assets.map((asset) => (
          <AssetCardEditor key={asset.id} asset={asset} onSave={handleSave} onDelete={handleDelete} />
        ))}
      </div>
      <div className="mx-auto mt-5 max-w-5xl">
        <button type="button" onClick={handleAddAsset} className="text-sm font-semibold text-primary">
          + Add another asset
        </button>
      </div>
      {error ? <p className="mt-4 text-center text-sm font-semibold text-red-600">{error}</p> : null}
      <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-3">
        <Button
          className="h-12 w-full rounded-full text-base"
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Complete Onboarding"}
        </Button>
        <Button variant="outline" className="h-12 w-full rounded-full text-base" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
