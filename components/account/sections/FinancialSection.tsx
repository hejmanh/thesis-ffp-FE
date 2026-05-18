"use client";

import { useReducer, useState } from "react";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import AssetForm from "@/components/account/forms/AssetForm";
import StageEditorCard, { type StageEditorValue } from "@/components/common/StageEditorCard";
import FinancialForm from "@/components/account/forms/FinancialForm";
import type { OnboardingDraft } from "@/types/onboarding";
import { buildHardcodedStages } from "@/utils/stageDefaults";
import { ASSET_TYPE_OPTIONS } from "@/utils/onboardingConstants";
import type { Allocation, Asset, FinancialData, Habits, Stage } from "@/utils/types";

const ONBOARDING_STORAGE_KEY = "coinfused_onboarding_payload";

type FinancialAction =
  | { type: "update_root"; field: "estimatedLE" | "savings" | "currency" | "desiredLE"; value: string }
  | { type: "update_allocation"; period: "before" | "after"; key: keyof Allocation; value: string }
  | { type: "update_habit"; key: keyof Habits; value: string }
  | { type: "update_stage"; index: number; stage: Stage }
  | { type: "set_assets"; assets: Asset[] };

const INITIAL_FINANCIAL_DATA: FinancialData = {
  estimatedLE: "",
  savings: "",
  currency: "USD",
  desiredLE: "",
  allocation: {
    before: { u: "", mu: "", rf: "" },
    after: { u: "", mu: "", rf: "" },
  },
  habits: {
    smoking: "",
    physical: "",
    diet: "",
    alcohol: "",
  },
  stages: [],
  assets: [],
};

function createEmptyAsset(): Asset {
  return {
    id: crypto.randomUUID(),
    assetTypeId: "",
    initialAnnualIncome: "",
    growthRate: "",
  };
}

function toStageEditorValue(stage: Stage): StageEditorValue {
  return {
    ageStart: stage.startAge,
    ageEnd: stage.endAge,
    annualSaving: stage.annualSaving,
    currency: stage.currency,
    annualRate: stage.growthRate,
  };
}

function fromStageEditorValue(stage: StageEditorValue): Stage {
  return {
    startAge: stage.ageStart,
    endAge: stage.ageEnd,
    annualSaving: stage.annualSaving,
    currency: stage.currency,
    growthRate: stage.annualRate,
  };
}

function isStageComplete(stage: Stage): boolean {
  return Boolean(stage.startAge && stage.endAge && stage.annualSaving && stage.currency && stage.growthRate);
}

function isAssetComplete(asset: Asset): boolean {
  return Boolean(asset.assetTypeId && asset.initialAnnualIncome && asset.growthRate);
}

function mapOnboardingStageToFinancialStage(stage: OnboardingDraft["stages"][number]): Stage {
  return {
    startAge: stage.ageStart,
    endAge: stage.ageEnd,
    annualSaving: stage.annualSaving,
    currency: stage.currency,
    growthRate: stage.annualRate,
  };
}

function mapOnboardingAssetToFinancialAsset(asset: OnboardingDraft["assets"][number]): Asset {
  // Cast to a loose record so we can safely read legacy field names that
  // pre-date the current AssetItem schema (type → assetTypeId, amount → initialAnnualIncome).
  const raw = asset as unknown as Record<string, string | undefined>;

  let assetTypeId = raw.assetTypeId ?? "";
  if (!assetTypeId && raw.type) {
    const match = ASSET_TYPE_OPTIONS.find(
      (opt) => opt.label.toLowerCase() === raw.type!.toLowerCase()
    );
    assetTypeId = match ? String(match.id) : "";
  }

  return {
    id: raw.id ?? crypto.randomUUID(),
    assetTypeId,
    initialAnnualIncome: raw.initialAnnualIncome ?? raw.amount ?? "",
    growthRate: raw.growthRate ?? "",
  };
}

function writeAssetsToOnboardingDraft(assets: Asset[]) {
  if (typeof window === "undefined") return;

  const currentDraft = readOnboardingDraft();
  if (!currentDraft) return;

  window.localStorage.setItem(
    ONBOARDING_STORAGE_KEY,
    JSON.stringify({
      ...currentDraft,
      assets: assets.map((asset) => ({
        id: asset.id,
        assetTypeId: asset.assetTypeId,
        initialAnnualIncome: asset.initialAnnualIncome,
        growthRate: asset.growthRate,
      })),
    } satisfies OnboardingDraft)
  );
}

function readOnboardingDraft(): OnboardingDraft | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OnboardingDraft;
  } catch {
    return null;
  }
}

function createFinancialDataFromOnboarding(draft: OnboardingDraft | null): FinancialData {
  if (!draft) {
    return {
      ...INITIAL_FINANCIAL_DATA,
      stages: buildHardcodedStages([], INITIAL_FINANCIAL_DATA.currency),
    };
  }

  const data: FinancialData = {
    estimatedLE: draft.step2.estimatedLifeExpectancy,
    savings: draft.step2.currentSavings,
    currency: draft.step2.preferredCurrency,
    desiredLE: draft.step2.desiredLifeExpectancy,
    allocation: {
      before: { ...draft.step2.beforeFfp },
      after: { ...draft.step2.afterFfp },
    },
    habits: {
      smoking: draft.step2.habits.smoke,
      physical: draft.step2.habits.physical,
      diet: draft.step2.habits.diet,
      alcohol: draft.step2.habits.alcohol,
    },
    stages: draft.stages.map(mapOnboardingStageToFinancialStage),
    assets: draft.assets.map(mapOnboardingAssetToFinancialAsset),
  };

  if (data.stages.length > 0) {
    return data;
  }

  return {
    ...data,
    stages: buildHardcodedStages(data.stages, data.currency),
  };
}

function financialReducer(state: FinancialData, action: FinancialAction): FinancialData {
  switch (action.type) {
    case "update_root":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "update_allocation":
      return {
        ...state,
        allocation: {
          ...state.allocation,
          [action.period]: {
            ...state.allocation[action.period],
            [action.key]: action.value,
          },
        },
      };
    case "update_habit":
      return {
        ...state,
        habits: {
          ...state.habits,
          [action.key]: action.value,
        },
      };
    case "update_stage":
      return {
        ...state,
        stages: state.stages.map((stage, index) => (index === action.index ? action.stage : stage)),
      };
    case "set_assets":
      return {
        ...state,
        assets: action.assets,
      };
    default:
      return state;
  }
}

export default function FinancialSection() {
  const [financialData, dispatch] = useReducer(
    financialReducer,
    createFinancialDataFromOnboarding(readOnboardingDraft())
  );
  const [draftProfile, setDraftProfile] = useState({
    estimatedLE: financialData.estimatedLE,
    savings: financialData.savings,
    currency: financialData.currency,
    desiredLE: financialData.desiredLE,
  });
  const [draftAllocation, setDraftAllocation] = useState(financialData.allocation);
  const [draftHabits, setDraftHabits] = useState(financialData.habits);
  const [draftStages, setDraftStages] = useState(financialData.stages);
  const [draftAssets, setDraftAssets] = useState(financialData.assets);

  function handleProfileChange(field: keyof typeof draftProfile, value: string) {
    setDraftProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleSaveProfile() {
    dispatch({ type: "update_root", field: "estimatedLE", value: draftProfile.estimatedLE });
    dispatch({ type: "update_root", field: "savings", value: draftProfile.savings });
    dispatch({ type: "update_root", field: "currency", value: draftProfile.currency });
    dispatch({ type: "update_root", field: "desiredLE", value: draftProfile.desiredLE });
  }

  function handleAllocationChange(period: "before" | "after", key: keyof Allocation, value: string) {
    setDraftAllocation((prev) => ({
      ...prev,
      [period]: {
        ...prev[period],
        [key]: value,
      },
    }));
  }

  function handleSaveAllocations() {
    (["before", "after"] as const).forEach((period) => {
      (["u", "mu", "rf"] as const).forEach((key) => {
        dispatch({
          type: "update_allocation",
          period,
          key,
          value: draftAllocation[period][key],
        });
      });
    });
  }

  function handleHabitChange(key: keyof Habits, value: string) {
    setDraftHabits((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSaveHabits() {
    (Object.keys(draftHabits) as Array<keyof Habits>).forEach((key) => {
      dispatch({ type: "update_habit", key, value: draftHabits[key] });
    });
  }

  function handleStageChange(index: number, next: StageEditorValue) {
    setDraftStages((prev) =>
      prev.map((stage, currentIndex) => (currentIndex === index ? fromStageEditorValue(next) : stage))
    );
  }

  function handleSaveStages() {
    draftStages.forEach((stage, index) => {
      dispatch({ type: "update_stage", index, stage });
    });
  }

  function handleAssetChange(index: number, next: Asset) {
    setDraftAssets((prev) => prev.map((asset, currentIndex) => (currentIndex === index ? next : asset)));
  }

  function handleAddAsset() {
    setDraftAssets((prev) => [...prev, createEmptyAsset()]);
  }

  function handleRemoveAsset(index: number) {
    setDraftAssets((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  }

  function handleSaveAssets() {
    dispatch({ type: "set_assets", assets: draftAssets });
    writeAssetsToOnboardingDraft(draftAssets);
  }

  const canSaveProfile = Boolean(
    draftProfile.estimatedLE && draftProfile.savings && draftProfile.currency && draftProfile.desiredLE
  );
  const canSaveAllocations = (["before", "after"] as const).every((period) =>
    (["u", "mu", "rf"] as const).every((key) => Boolean(draftAllocation[period][key]))
  );
  const canSaveHabits = (Object.keys(draftHabits) as Array<keyof Habits>).every((key) =>
    Boolean(draftHabits[key])
  );
  const canSaveStages = draftStages.length > 0 && draftStages.every(isStageComplete);
  const canSaveAssets = draftAssets.every(isAssetComplete);

  return (
    <Card hoverable={false} className="w-full rounded-xl bg-white p-6 shadow-md">
      <h2 className="text-2xl font-bold text-primary">Financial Profile and Planning</h2>
      <p className="mt-1 text-sm text-muted-foreground">Manage your financial background, investment assumptions, lifestyle habits, life stages, and asset information.</p>

      <div className="mt-6 space-y-6">
        <FinancialForm
          profile={draftProfile}
          allocation={draftAllocation}
          habits={draftHabits}
          onProfileChange={handleProfileChange}
          onAllocationChange={handleAllocationChange}
          onHabitChange={handleHabitChange}
          onSaveProfile={handleSaveProfile}
          onSaveAllocations={handleSaveAllocations}
          onSaveHabits={handleSaveHabits}
          canSaveProfile={canSaveProfile}
          canSaveAllocations={canSaveAllocations}
          canSaveHabits={canSaveHabits}
        />

        <div className="rounded-xl border border-border bg-slate-50 p-4">
          <h3 className="text-base font-semibold text-slate-900">Life Stages</h3>
          <p className="mt-1 text-xs italic text-slate-600">Includes all pre-FFP income sources (e.g. salary, rental income, etc.)</p>
          <div className="mt-4 max-h-[24rem] space-y-4 overflow-y-auto pr-2">
            {draftStages.map((stage, index) => (
              <StageEditorCard
                key={`stage_${index}`}
                variant="account"
                stage={toStageEditorValue(stage)}
                index={index}
                onChange={(next) => handleStageChange(index, next)}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button size="sm" onClick={handleSaveStages} disabled={!canSaveStages}>
              Save changes
            </Button>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Assets</h3>
            <button type="button" onClick={handleAddAsset} className="text-sm font-semibold text-primary">
              + Add asset
            </button>
          </div>
          {draftAssets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No assets yet.</p>
          ) : (
            draftAssets.map((asset, index) => (
              <AssetForm
                key={`asset_${index}`}
                asset={asset}
                index={index}
                onChange={(next) => handleAssetChange(index, next)}
                onRemove={() => handleRemoveAsset(index)}
              />
            ))
          )}
          <div className="flex justify-end">
            <Button size="sm" onClick={handleSaveAssets} disabled={!canSaveAssets}>
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
