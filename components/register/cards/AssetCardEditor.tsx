"use client";

import AssetEditorCard from "@/components/common/AssetEditorCard";
import type { AssetItem } from "@/types/onboarding";

interface AssetCardEditorProps {
  asset: AssetItem;
  index: number;
  onChange: (asset: AssetItem) => void;
  onDelete: (assetId: string) => void;
}

export default function AssetCardEditor({ asset, index, onChange, onDelete }: AssetCardEditorProps) {
  return (
    <AssetEditorCard
      asset={asset}
      index={index}
      onChange={onChange}
      onDelete={() => onDelete(asset.id)}
      idPrefix={`register_asset_${asset.id}_`}
      getTitle={(_, assetIndex) => `Asset ${assetIndex + 1}`}
    />
  );
}
