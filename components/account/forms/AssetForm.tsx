"use client";

import AssetEditorCard from "@/components/common/AssetEditorCard";
import type { SelectOption } from "@/utils/referenceOptions";
import type { Asset } from "@/utils/types";
import { useTranslations } from "@/i18n/client";

interface AssetFormProps {
  asset: Asset;
  index: number;
  assetTypeOptions: SelectOption[];
  onChange: (next: Asset) => void;
  onRemove: () => void;
}

export default function AssetForm({
  asset,
  index,
  assetTypeOptions,
  onChange,
  onRemove,
}: AssetFormProps) {
  const t = useTranslations("Account.assets");

  return (
    <AssetEditorCard
      asset={asset}
      index={index}
      onChange={onChange}
      onDelete={onRemove}
      idPrefix={`account_asset_${index}_`}
      className="rounded-xl border border-border bg-white p-4"
      titleClassName="text-sm font-semibold text-slate-900"
      deleteActionClassName="text-sm font-semibold text-red-600"
      deleteLabel={t("remove")}
      getTitle={(_, assetIndex) => `Asset ${assetIndex + 1}`}
      assetTypeOptions={assetTypeOptions}
    />
  );
}
