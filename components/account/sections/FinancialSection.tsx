"use client";

import { useEffect, useReducer, useState } from "react";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import AssetForm from "@/components/account/forms/AssetForm";
import StageEditorCard, { type StageEditorValue } from "@/components/common/StageEditorCard";
import FinancialForm from "@/components/account/forms/FinancialForm";
import type { OnboardingDraft } from "@/types/onboarding";
import { buildHardcodedStages } from "@/utils/stageDefaults";
import type { Allocation, Asset, FinancialData, Habits, Stage } from "@/utils/types";

const ONBOARDING_STORAGE_KEY = "coinfused_onboarding_payload";

type FinancialAction =
  | { type: "update_root"; field: "estimatedLE" | "savings" | "currency" | "desiredLE"; value: string }
  | { type: "update_allocation"; period: "before" | "after"; key: keyof Allocation; value: string }
  | { type: "update_habit"; key: keyof Habits; value: string }
  | { type: "update_stage"; index: number; stage: Stage }
  | { type: "add_asset" }
  | { type: "update_asset"; index: number; asset: Asset }
  | { type: "remove_asset"; index: number };

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
    name: "",
    amount: "",
    currency: "USD",
    type: "",
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
  return {
    name: asset.name,
    amount: asset.amount,
    currency: asset.currency,
    type: asset.type,
    growthRate: asset.growthRate,
  };
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
    case "add_asset":
      return {
        ...state,
        assets: [...state.assets, createEmptyAsset()],
      };
    case "update_asset":
      return {
        ...state,
        assets: state.assets.map((asset, index) => (index === action.index ? action.asset : asset)),
      };
    case "remove_asset":
      return {
        ...state,
        assets: state.assets.filter((_, index) => index !== action.index),
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
  const [draftStages, setDraftStages] = useState(financialData.stages);

  useEffect(() => {
    setDraftStages(financialData.stages);
  }, [financialData.stages]);

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

  const canSaveStages = draftStages.length > 0 && draftStages.every(isStageComplete);

  return (
    <Card hoverable={false} className="w-full rounded-xl bg-white p-6 shadow-md">
      <h2 className="text-2xl font-bold text-primary">Financial Profile and Planning</h2>
      <p className="mt-1 text-sm text-muted-foreground">Manage your financial background, investment assumptions, lifestyle habits, life stages, and asset information.</p>

      <div className="mt-6 space-y-6">
        <FinancialForm
          data={financialData}
          onRootChange={(field, value) => dispatch({ type: "update_root", field, value })}
          onAllocationChange={(period, key, value) =>
            dispatch({ type: "update_allocation", period, key, value })
          }
          onHabitChange={(key, value) => dispatch({ type: "update_habit", key, value })}
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
            <Button className="mr-6" size="sm" onClick={handleSaveStages} disabled={!canSaveStages}>
              Save stages
            </Button>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Assets</h3>
            <button type="button" onClick={() => dispatch({ type: "add_asset" })} className="text-sm font-semibold text-primary">
              + Add asset
            </button>
          </div>
          {financialData.assets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No assets yet.</p>
          ) : (
            financialData.assets.map((asset, index) => (
              <AssetForm
                key={`asset_${index}`}
                asset={asset}
                index={index}
                onChange={(next) => dispatch({ type: "update_asset", index, asset: next })}
                onRemove={() => dispatch({ type: "remove_asset", index })}
              />
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
