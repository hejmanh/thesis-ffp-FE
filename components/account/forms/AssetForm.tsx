"use client";

import AssetEditorCard from "@/components/common/AssetEditorCard";
import type { Asset } from "@/utils/types";

interface AssetFormProps {
  asset: Asset;
  index: number;
  onChange: (next: Asset) => void;
  onRemove: () => void;
}

export default function AssetForm({ asset, index, onChange, onRemove }: AssetFormProps) {
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
      deleteLabel="Remove"
      getTitle={(_, assetIndex) => `Asset ${assetIndex + 1}`}
    />
  );
}
