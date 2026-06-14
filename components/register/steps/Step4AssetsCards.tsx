"use client";

import { useEnterToFocusNextField } from "@/components/common/useEnterToFocusNextField";
import AssetCardEditor from "@/components/register/cards/AssetCardEditor";
import StepNavigationActions from "@/components/register/steps/StepNavigationActions";
import type { AssetItem } from "@/types/onboarding";
import type { SelectOption } from "@/utils/referenceOptions";
import { isAssetComplete } from "@/utils/onboardingValidators";
import { useTranslations } from "@/i18n/client";

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
  const t = useTranslations("Register.assets");
  const steps = useTranslations("Register.steps");
  const { containerRef, handleEnterKeyDown } = useEnterToFocusNextField();

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
    <div
      ref={containerRef}
      className="mt-8"
      onKeyDown={handleEnterKeyDown}
    >
      {/* <h2 className="text-center text-3xl font-bold text-primary">Asset Data</h2> */}
      <p className="mt-2 text-center text-sm text-muted-foreground">
        {t("description")}
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
          {t("addAnother")}
        </button>
      </div>
      {isReferenceLoading ? (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t("loadingTypes")}
        </p>
      ) : null}
      {referenceError ? (
        <p className="mt-4 text-center text-sm font-semibold text-red-600">
          {referenceError}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 text-center text-sm font-semibold text-red-600">
          {error}
        </p>
      ) : null}
      <StepNavigationActions
        className="max-w-5xl"
        layout="column"
        nextLabel={steps("completeOnboarding")}
        isSubmitting={isSubmitting}
        nextDisabled={!canSubmit || isReferenceLoading}
        onBack={onBack}
        onNext={onSubmit}
      />
    </div>
  );
}
