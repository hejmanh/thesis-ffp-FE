"use client";

import Button from "@/components/common/Button";
import AssetCardEditor from "@/components/register/cards/AssetCardEditor";
import type { AssetItem } from "@/types/onboarding";
import type { SelectOption } from "@/utils/referenceOptions";
import { isAssetComplete } from "@/utils/onboardingValidators";

interface Step4AssetsCardsProps {
  assets: AssetItem[];
  assetTypeOptions: SelectOption[];
  error: string;
  referenceError?: string | null;
  isReferenceLoading: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
  onChange: (assets: AssetItem[]) => void;
}

function makeEmptyAsset(): AssetItem {
  return {
    id: crypto.randomUUID(),
    assetTypeId: "",
    initialAnnualIncome: "",
    growthRate: "",
  };
}

export default function Step4AssetsCards({
  assets,
  assetTypeOptions,
  error,
  referenceError,
  isReferenceLoading,
  isSubmitting,
  onBack,
  onSubmit,
  onChange,
}: Step4AssetsCardsProps) {
  function handleAssetChange(updated: AssetItem) {
    onChange(assets.map((asset) => (asset.id === updated.id ? updated : asset)));
  }

  function handleDelete(assetId: string) {
    onChange(assets.filter((asset) => asset.id !== assetId));
  }

  function handleAddAsset() {
    onChange([...assets, makeEmptyAsset()]);
  }

  const canSubmit = assets.length === 0 || assets.every(isAssetComplete);

  return (
    <div className="mt-8">
      <h2 className="text-center text-3xl font-bold text-primary">Asset Data</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Add and organize your assets with growth assumptions
      </p>
      <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-5">
        {assets.map((asset, index) => (
          <AssetCardEditor
            key={asset.id}
            asset={asset}
            index={index}
            assetTypeOptions={assetTypeOptions}
            onChange={handleAssetChange}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <div className="mx-auto mt-5 max-w-5xl">
        <button
          type="button"
          onClick={handleAddAsset}
          className="text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:text-slate-400"
          disabled={isReferenceLoading || assetTypeOptions.length === 0}
        >
          + Add another asset
        </button>
      </div>
      {isReferenceLoading ? (
        <p className="mt-4 text-center text-sm text-muted-foreground">Loading asset types...</p>
      ) : null}
      {referenceError ? (
        <p className="mt-4 text-center text-sm font-semibold text-red-600">{referenceError}</p>
      ) : null}
      {error ? <p className="mt-4 text-center text-sm font-semibold text-red-600">{error}</p> : null}
      <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-3">
        <Button
          className="h-12 w-full rounded-full text-base"
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting || isReferenceLoading}
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
