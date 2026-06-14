"use client";

import FormField from "@/components/common/FormField";
import type { SelectOption } from "@/utils/referenceOptions";
import { useTranslations } from "@/i18n/client";

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
  assetTypeOptions: SelectOption[];
  assetTypeDisabled?: boolean;
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
  assetTypeOptions,
  assetTypeDisabled = false,
}: AssetEditorCardProps<TAsset>) {
  const fields = useTranslations("Fields");

  function updateField<K extends keyof AssetEditorValue>(
    key: K,
    value: AssetEditorValue[K],
  ) {
    onChange({
      ...asset,
      [key]: value,
    });
  }

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className={titleClassName}>
          {getTitle?.(asset, index) ?? `Asset ${index + 1}`}
        </h3>
        {onDelete ? (
          <button
            type="button"
            className={deleteActionClassName}
            onClick={onDelete}
          >
            {deleteLabel}
          </button>
        ) : null}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id={`${idPrefix}assetTypeId`}
          name={`${idPrefix}assetTypeId`}
          label={fields("assetType")}
          variant="select"
          className="sm:col-span-2"
          placeholder={fields("selectAssetType")}
          selectClassName="h-11"
          value={asset.assetTypeId}
          onChange={(value) => updateField("assetTypeId", value)}
          options={assetTypeOptions}
          disabled={assetTypeDisabled}
        />
        <FormField
          id={`${idPrefix}initialAnnualIncome`}
          name={`${idPrefix}initialAnnualIncome`}
          label={fields("initialAnnualIncome")}
          inputClassName="h-11"
          placeholder={fields("placeholderMoney")}
          inputProps={{
            value: asset.initialAnnualIncome,
            onChange: (event) =>
              updateField("initialAnnualIncome", event.target.value),
            inputMode: "decimal",
            autoComplete: "off",
          }}
        />
        <FormField
          id={`${idPrefix}growthRate`}
          name={`${idPrefix}growthRate`}
          label={fields("growthRate")}
          inputClassName="h-11"
          placeholder={fields("growthRate")}
          suffix="%"
          inputProps={{
            value: asset.growthRate,
            onChange: (event) => updateField("growthRate", event.target.value),
            type: "number",
            step: "1",
            inputMode: "decimal",
            autoComplete: "off",
          }}
        />
      </div>
    </div>
  );
}
