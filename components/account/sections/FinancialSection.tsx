"use client";

import { useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import AssetForm from "@/components/account/forms/AssetForm";
import StageEditorCard, {
  type StageEditorValue,
} from "@/components/common/StageEditorCard";
import FinancialForm from "@/components/account/forms/FinancialForm";
import { useFinancialPlanningReferences } from "@/hooks";
import { userInfoService } from "@/services/userInfo.service";
import type { SelectOption } from "@/utils/referenceOptions";
import {
  buildCreateAssetsRequest,
  buildPatchAssetsRequest,
  buildPatchBasicRequest,
  buildPatchLifestyleRequest,
  buildPatchPortfolioRequest,
  buildPatchStagesRequest,
  mapUserInfoToFinancialData,
} from "@/utils/userInfoMappers";
import type { Asset, FinancialData, Habits, Stage } from "@/utils/types";
import type { GetUserInfoResponse } from "@/types/userInfo";

const EMPTY_FINANCIAL_DATA: FinancialData = {
  estimatedLE: "",
  savings: "",
  currency: "",
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
    title: stage.title,
    ageStart: stage.startAge,
    ageEnd: stage.endAge,
    annualSaving: stage.annualSaving,
    currency: stage.currency,
    annualRate: stage.growthRate,
  };
}

function fromStageEditorValue(stage: Stage, next: StageEditorValue): Stage {
  return {
    ...stage,
    startAge: next.ageStart,
    endAge: next.ageEnd,
    annualSaving: next.annualSaving,
    currency: next.currency,
    growthRate: next.annualRate,
  };
}

function isStageComplete(stage: Stage): boolean {
  return Boolean(
    stage.lifeStageRangeId &&
      stage.annualSaving &&
      stage.currency &&
      stage.growthRate,
  );
}

function isAssetComplete(asset: Asset): boolean {
  return Boolean(
    asset.assetTypeId && asset.initialAnnualIncome && asset.growthRate,
  );
}

function areValuesEqual<T>(left: T, right: T): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function getChangedPersistedAssets(
  currentAssets: Asset[],
  baseAssets: Asset[],
): Asset[] {
  const baseAssetsByUid = new Map(
    baseAssets
      .filter((asset) => asset.uid)
      .map((asset) => [asset.uid as string, asset]),
  );

  return currentAssets.filter((asset) => {
    if (!asset.uid) {
      return false;
    }

    const baseAsset = baseAssetsByUid.get(asset.uid);
    if (!baseAsset) {
      return false;
    }

    return (
      baseAsset.initialAnnualIncome !== asset.initialAnnualIncome ||
      baseAsset.growthRate !== asset.growthRate
    );
  });
}

function getAssetOptionsForAsset(
  asset: Asset,
  assetTypeOptions: SelectOption[],
): SelectOption[] {
  if (
    !asset.assetTypeId ||
    assetTypeOptions.some((option) => option.value === asset.assetTypeId)
  ) {
    return assetTypeOptions;
  }

  return [
    {
      label:
        asset.assetTypeTitle ??
        asset.assetTypeCode ??
        `Asset ${asset.assetTypeId}`,
      value: asset.assetTypeId,
    },
    ...assetTypeOptions,
  ];
}

export default function FinancialSection() {
  const queryClient = useQueryClient();
  const references = useFinancialPlanningReferences();
  const [profileDraft, setProfileDraft] = useState<{
    estimatedLE: string;
    savings: string;
    currency: string;
    desiredLE: string;
  } | null>(null);
  const [allocationDraft, setAllocationDraft] = useState<
    FinancialData["allocation"] | null
  >(null);
  const [habitsDraft, setHabitsDraft] = useState<Habits | null>(null);
  const [stagesDraft, setStagesDraft] = useState<Stage[] | null>(null);
  const [assetsDraft, setAssetsDraft] = useState<Asset[] | null>(null);
  const [sectionError, setSectionError] = useState<string | null>(null);

  const userInfoQuery = useQuery({
    queryKey: ["user-info"],
    queryFn: () => userInfoService.getUserInfo(),
  });

  const patchBasicMutation = useMutation({
    mutationFn: userInfoService.patchBasic,
  });
  const patchPortfolioMutation = useMutation({
    mutationFn: userInfoService.patchPortfolio,
  });
  const patchLifestyleMutation = useMutation({
    mutationFn: userInfoService.patchLifestyle,
  });
  const patchStagesMutation = useMutation({
    mutationFn: userInfoService.patchStages,
  });
  const createAssetsMutation = useMutation({
    mutationFn: userInfoService.createAssets,
  });
  const patchAssetsMutation = useMutation({
    mutationFn: userInfoService.patchAssets,
  });
  const deleteAssetMutation = useMutation({
    mutationFn: userInfoService.deleteAsset,
  });

  const baseFinancialData = useMemo(() => {
    if (!userInfoQuery.data) {
      return EMPTY_FINANCIAL_DATA;
    }

    return mapUserInfoToFinancialData(userInfoQuery.data);
  }, [userInfoQuery.data]);

  const currentProfile = profileDraft ?? {
    estimatedLE: baseFinancialData.estimatedLE,
    savings: baseFinancialData.savings,
    currency: baseFinancialData.currency,
    desiredLE: baseFinancialData.desiredLE,
  };
  const currentAllocation = allocationDraft ?? baseFinancialData.allocation;
  const currentHabits = habitsDraft ?? baseFinancialData.habits;
  const currentStages = stagesDraft ?? baseFinancialData.stages;
  const currentAssets = assetsDraft ?? baseFinancialData.assets;

  const isLoading = userInfoQuery.isLoading;
  const isSavingProfile = patchBasicMutation.isPending;
  const isSavingAllocation = patchPortfolioMutation.isPending;
  const isSavingHabits = patchLifestyleMutation.isPending;
  const isSavingStages = patchStagesMutation.isPending;
  const isSavingAssets =
    createAssetsMutation.isPending ||
    patchAssetsMutation.isPending ||
    deleteAssetMutation.isPending;
  const pageError =
    sectionError ??
    (userInfoQuery.error instanceof Error ? userInfoQuery.error.message : null) ??
    references.error;

  const canSaveProfile =
    Boolean(
      currentProfile.savings &&
        currentProfile.currency &&
        currentProfile.desiredLE,
    ) &&
    !areValuesEqual(currentProfile, {
      estimatedLE: baseFinancialData.estimatedLE,
      savings: baseFinancialData.savings,
      currency: baseFinancialData.currency,
      desiredLE: baseFinancialData.desiredLE,
    }) &&
    !isSavingProfile &&
    !references.isLoading;

  const canSaveAllocation =
    (["before", "after"] as const).every((period) =>
      (["u", "mu", "rf"] as const).every((key) =>
        Boolean(currentAllocation[period][key]),
      ),
    ) &&
    !areValuesEqual(currentAllocation, baseFinancialData.allocation) &&
    !isSavingAllocation;

  const canSaveHabits =
    (Object.keys(currentHabits) as Array<keyof Habits>).every((key) =>
      Boolean(currentHabits[key]),
    ) &&
    !areValuesEqual(currentHabits, baseFinancialData.habits) &&
    !isSavingHabits &&
    !references.isLoading;

  const newAssets = currentAssets.filter((asset) => !asset.uid);
  const changedPersistedAssets = getChangedPersistedAssets(
    currentAssets,
    baseFinancialData.assets,
  );
  const canSaveStages =
    currentStages.length > 0 &&
    currentStages.every(isStageComplete) &&
    !areValuesEqual(currentStages, baseFinancialData.stages) &&
    !isSavingStages;
  const canSaveAssets =
    currentAssets.every(isAssetComplete) &&
    (newAssets.length > 0 || changedPersistedAssets.length > 0) &&
    !isSavingAssets &&
    !references.isLoading;

  async function refreshUserInfoData() {
    await queryClient.invalidateQueries({ queryKey: ["user-info"] });
  }

  async function handleSaveProfile() {
    setSectionError(null);
    try {
      await patchBasicMutation.mutateAsync(
        buildPatchBasicRequest(currentProfile),
      );
      setProfileDraft(null);
      await refreshUserInfoData();
    } catch (error) {
      setSectionError(
        error instanceof Error
          ? error.message
          : "Unable to update financial profile.",
      );
    }
  }

  async function handleSaveAllocations() {
    setSectionError(null);
    try {
      await patchPortfolioMutation.mutateAsync(
        buildPatchPortfolioRequest(currentAllocation),
      );
      setAllocationDraft(null);
      await refreshUserInfoData();
    } catch (error) {
      setSectionError(
        error instanceof Error
          ? error.message
          : "Unable to update asset allocation.",
      );
    }
  }

  async function handleSaveHabits() {
    setSectionError(null);
    try {
      const lifestyleResponse = await patchLifestyleMutation.mutateAsync(
        buildPatchLifestyleRequest(currentHabits),
      );
      queryClient.setQueryData<GetUserInfoResponse | undefined>(
        ["user-info"],
        (currentData) => {
          if (!currentData) {
            return currentData;
          }

          return {
            ...currentData,
            userInfo: {
              ...currentData.userInfo,
              lifestyleProfile: lifestyleResponse.lifestyleProfile,
              financialProfile: {
                ...currentData.userInfo.financialProfile,
                estimatedLifeExpectancy:
                  lifestyleResponse.estimatedLifeExpectancy,
              },
            },
          };
        },
      );
      setProfileDraft((prev) =>
        prev
          ? {
              ...prev,
              estimatedLE: String(lifestyleResponse.estimatedLifeExpectancy),
            }
          : prev,
      );
      setHabitsDraft(null);
    } catch (error) {
      setSectionError(
        error instanceof Error
          ? error.message
          : "Unable to update lifestyle profile.",
      );
    }
  }

  async function handleSaveStages() {
    setSectionError(null);
    try {
      await patchStagesMutation.mutateAsync(
        buildPatchStagesRequest(currentStages),
      );
      setStagesDraft(null);
      await refreshUserInfoData();
    } catch (error) {
      setSectionError(
        error instanceof Error ? error.message : "Unable to update stages.",
      );
    }
  }

  async function handleSaveAssets() {
    setSectionError(null);
    try {
      if (newAssets.length > 0) {
        await createAssetsMutation.mutateAsync(
          buildCreateAssetsRequest(newAssets),
        );
      }

      if (changedPersistedAssets.length > 0) {
        await patchAssetsMutation.mutateAsync(
          buildPatchAssetsRequest(changedPersistedAssets),
        );
      }

      setAssetsDraft(null);
      await refreshUserInfoData();
    } catch (error) {
      setSectionError(
        error instanceof Error ? error.message : "Unable to update assets.",
      );
    }
  }

  async function handleRemoveAsset(asset: Asset, index: number) {
    setSectionError(null);

    if (!asset.uid) {
      setAssetsDraft((prev) => {
        const sourceAssets = prev ?? baseFinancialData.assets;
        return sourceAssets.filter((_, currentIndex) => currentIndex !== index);
      });
      return;
    }

    try {
      await deleteAssetMutation.mutateAsync(asset.uid);
      setAssetsDraft((prev) => {
        if (!prev) {
          return prev;
        }

        return prev.filter((_, currentIndex) => currentIndex !== index);
      });
      await refreshUserInfoData();
    } catch (error) {
      setSectionError(
        error instanceof Error ? error.message : "Unable to delete asset.",
      );
    }
  }

  if (isLoading) {
    return (
      <Card hoverable={false} className="w-full rounded-xl bg-white p-6 shadow-md">
        <h2 className="text-2xl font-bold text-primary">
          Financial Profile and Planning
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Loading your financial profile...
        </p>
      </Card>
    );
  }

  if (!userInfoQuery.data) {
    return (
      <Card hoverable={false} className="w-full rounded-xl bg-white p-6 shadow-md">
        <h2 className="text-2xl font-bold text-primary">
          Financial Profile and Planning
        </h2>
        <p className="mt-4 text-sm font-semibold text-red-600">
          {pageError ?? "Unable to load financial profile."}
        </p>
        <div className="mt-4">
          <Button size="sm" onClick={() => userInfoQuery.refetch()}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card hoverable={false} className="w-full rounded-xl bg-white p-6 shadow-md">
      <h2 className="text-2xl font-bold text-primary">
        Financial Profile and Planning
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your financial background, investment assumptions, lifestyle
        habits, life stages, and asset information.
      </p>
      {pageError ? (
        <p className="mt-4 text-sm font-semibold text-red-600">{pageError}</p>
      ) : null}

      <div className="mt-6 space-y-6">
        <FinancialForm
          profile={currentProfile}
          allocation={currentAllocation}
          habits={currentHabits}
          currencyOptions={references.currencyOptions}
          habitOptions={{
            smoking: references.smokingOptions,
            physical: references.physicalActivityOptions,
            diet: references.dietQualityOptions,
            alcohol: references.alcoholConsumptionOptions,
          }}
          onProfileChange={(field, value) => {
            setProfileDraft((prev) => ({
              ...(prev ?? {
                estimatedLE: baseFinancialData.estimatedLE,
                savings: baseFinancialData.savings,
                currency: baseFinancialData.currency,
                desiredLE: baseFinancialData.desiredLE,
              }),
              [field]: value,
            }));
          }}
          onAllocationChange={(period, key, value) => {
            setAllocationDraft((prev) => ({
              ...(prev ?? baseFinancialData.allocation),
              [period]: {
                ...(prev ?? baseFinancialData.allocation)[period],
                [key]: value,
              },
            }));
          }}
          onHabitChange={(key, value) => {
            setHabitsDraft((prev) => ({
              ...(prev ?? baseFinancialData.habits),
              [key]: value,
            }));
          }}
          onSaveProfile={handleSaveProfile}
          onSaveAllocations={handleSaveAllocations}
          onSaveHabits={handleSaveHabits}
          canSaveProfile={canSaveProfile}
          canSaveAllocations={canSaveAllocation}
          canSaveHabits={canSaveHabits}
        />

        <div className="rounded-xl border border-border bg-slate-50 p-4">
          <h3 className="text-base font-semibold text-slate-900">Life Stages</h3>
          <p className="mt-1 text-xs italic text-slate-600">
            Includes all pre-FFP income sources (e.g. salary, rental income,
            etc.)
          </p>
          <div className="mt-4 max-h-[24rem] space-y-4 overflow-y-auto pr-2">
            {currentStages.map((stage, index) => (
              <StageEditorCard
                key={`stage_${stage.lifeStageRangeId ?? index}`}
                variant="account"
                stage={toStageEditorValue(stage)}
                index={index}
                onChange={(next) =>
                  setStagesDraft((prev) => {
                    const sourceStages = prev ?? baseFinancialData.stages;
                    return sourceStages.map((currentStage, currentIndex) =>
                      currentIndex === index
                        ? fromStageEditorValue(currentStage, next)
                        : currentStage,
                    );
                  })
                }
              />
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              size="sm"
              onClick={handleSaveStages}
              disabled={!canSaveStages}
            >
              {isSavingStages ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-slate-50 p-4">
          <h3 className="text-base font-semibold text-slate-900">Assets</h3>
          <p className="mt-1 text-xs italic text-slate-600">
            Add additional income-generating assets such as rental properties, pensions, or investments.
          </p>
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setAssetsDraft((prev) => [
                  ...(prev ?? baseFinancialData.assets),
                  createEmptyAsset(),
                ])
              }
              className="text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:text-slate-400"
              disabled={references.isLoading || references.assetTypeOptions.length === 0}
            >
              + Add asset
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {currentAssets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No assets yet.</p>
            ) : (
              currentAssets.map((asset, index) => (
                <AssetForm
                  key={asset.uid ?? asset.id}
                  asset={asset}
                  index={index}
                  assetTypeOptions={getAssetOptionsForAsset(
                    asset,
                    references.assetTypeOptions,
                  )}
                  onChange={(next) =>
                    setAssetsDraft((prev) => {
                      const sourceAssets = prev ?? baseFinancialData.assets;
                      return sourceAssets.map((currentAsset, currentIndex) =>
                        currentIndex === index ? next : currentAsset,
                      );
                    })
                  }
                  onRemove={() => void handleRemoveAsset(asset, index)}
                />
              ))
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              size="sm"
              onClick={handleSaveAssets}
              disabled={!canSaveAssets}
            >
              {isSavingAssets ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
