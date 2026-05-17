"use client";

import FormField from "@/components/common/FormField";
import { ASSET_TYPE_OPTIONS } from "@/utils/onboardingConstants";

export interface AssetEditorValue {
  assetTypeId: string;
  initialAnnualIncome: string;
  growthRate: string;
}

interface AssetEditorCardProps<TAsset extends AssetEditorValue> {
  asset: TAsset;
  index: number;
  onChange: (asset: TAsset) => void;
  onDelete?: () => void;
  idPrefix?: string;
  className?: string;
  titleClassName?: string;
  deleteActionClassName?: string;
  deleteLabel?: string;
  getTitle?: (asset: TAsset, index: number) => string;
}

export default function AssetEditorCard<TAsset extends AssetEditorValue>({
  asset,
  index,
  onChange,
  onDelete,
  idPrefix = "",
  className = "rounded-2xl border border-border bg-white p-5 shadow-sm",
  titleClassName = "text-xl font-semibold text-slate-900",
  deleteActionClassName = "text-sm font-semibold text-red-500",
  deleteLabel = "Delete",
  getTitle,
}: AssetEditorCardProps<TAsset>) {
  function updateField<K extends keyof AssetEditorValue>(key: K, value: AssetEditorValue[K]) {
    onChange({
      ...asset,
      [key]: value,
    });
  }

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className={titleClassName}>{getTitle?.(asset, index) ?? `Asset ${index + 1}`}</h3>
        {onDelete ? (
          <button type="button" className={deleteActionClassName} onClick={onDelete}>
            {deleteLabel}
          </button>
        ) : null}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id={`${idPrefix}assetTypeId`}
          name={`${idPrefix}assetTypeId`}
          label="Asset Type"
          variant="select"
          className="sm:col-span-2"
          placeholder="Select asset type"
          selectClassName="h-11"
          value={asset.assetTypeId}
          onChange={(value) => updateField("assetTypeId", value)}
          options={ASSET_TYPE_OPTIONS.map((option) => ({ label: option.label, value: String(option.id) }))}
        />
        <FormField
          id={`${idPrefix}initialAnnualIncome`}
          name={`${idPrefix}initialAnnualIncome`}
          label="Initial Annual Income"
          inputClassName="h-11"
          placeholder="Initial annual income"
          inputProps={{
            value: asset.initialAnnualIncome,
            onChange: (event) => updateField("initialAnnualIncome", event.target.value),
            inputMode: "decimal",
            autoComplete: "off",
          }}
        />
        <FormField
          id={`${idPrefix}growthRate`}
          name={`${idPrefix}growthRate`}
          label="Growth Rate"
          inputClassName="h-11"
          placeholder="Growth rate"
          suffix="%"
          inputProps={{
            value: asset.growthRate,
            onChange: (event) => updateField("growthRate", event.target.value),
            inputMode: "decimal",
            autoComplete: "off",
          }}
        />
      </div>
    </div>
  );
}
