"use client";

import { useEffect, useReducer } from "react";
import Card from "@/components/common/Card";
import AssetForm from "@/components/account/forms/AssetForm";
import FinancialForm from "@/components/account/forms/FinancialForm";
import StageForm from "@/components/account/forms/StageForm";
import { getSession } from "@/services/auth/mockAuth";
import { buildPreconfiguredStages, DEFAULT_STAGE_COUNT } from "@/utils/stageDefaults";
import type { Allocation, Asset, FinancialData, Habits, Stage } from "@/utils/types";

type FinancialAction =
  | { type: "update_root"; field: "estimatedLE" | "savings" | "currency" | "desiredLE"; value: string }
  | { type: "update_allocation"; period: "before" | "after"; key: keyof Allocation; value: string }
  | { type: "update_habit"; key: keyof Habits; value: string }
  | { type: "set_stages"; stages: Stage[] }
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
    case "set_stages":
      return {
        ...state,
        stages: action.stages,
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
  const session = getSession();
  const [financialData, dispatch] = useReducer(financialReducer, INITIAL_FINANCIAL_DATA);

  useEffect(() => {
    const generatedStages = buildPreconfiguredStages(
      financialData.stages,
      String(session?.user.birthYear ?? ""),
      financialData.desiredLE,
      financialData.currency
    );

    const shouldUpdate =
      generatedStages.length === DEFAULT_STAGE_COUNT &&
      JSON.stringify(generatedStages) !== JSON.stringify(financialData.stages);

    if (shouldUpdate) {
      dispatch({ type: "set_stages", stages: generatedStages });
    }
  }, [financialData.currency, financialData.desiredLE, financialData.stages, session?.user.birthYear]);

  return (
    <Card hoverable={false} className="w-full rounded-xl bg-white p-6 shadow-md">
      <h2 className="text-2xl font-bold text-primary">Financial Assumption</h2>
      <p className="mt-1 text-sm text-muted-foreground">Define your financial assumptions and long-term model inputs.</p>

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
          {financialData.stages.length === 0 ? (
            <p className="text-sm text-muted-foreground">Fill in desired life expectancy to generate your stage cards.</p>
          ) : (
            <div className="mt-4 max-h-[24rem] space-y-4 overflow-y-auto pr-2">
              {financialData.stages.map((stage, index) => (
                <StageForm
                  key={`stage_${index}`}
                  stage={stage}
                  index={index}
                  onChange={(next) => dispatch({ type: "update_stage", index, stage: next })}
                />
              ))}
            </div>
          )}
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
