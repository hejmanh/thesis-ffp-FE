"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import AssetForm from "@/components/account/forms/AssetForm";
import GeneralInformationForm from "@/components/account/forms/GeneralInformationForm";
import StageEditorCard, {
  type StageEditorValue,
} from "@/components/common/StageEditorCard";
import FinancialForm from "@/components/account/forms/FinancialForm";
import {
  useFinancialPlanningReferences,
  useLifeStageRangesQuery,
} from "@/hooks";
import { useUserContext } from "@/providers/UserContextProvider";
import { userInfoService } from "@/services/userInfo.service";
import type { UserInfoFinancialResource } from "@/types/userInfo";
import type { SelectOption } from "@/utils/referenceOptions";
import {
  buildAccountStagesFromRanges,
  buildCreateAssetsRequest,
  buildFinancialRequestFromFinancialData,
  buildPatchAssetsRequest,
  buildStagesRequest,
  mapUserInfoResourcesToFinancialData,
} from "@/utils/userInfoMappers";
import type { Asset, FinancialData, Habits, Stage } from "@/utils/types";
import { resolveCurrencyCode } from "@/utils/referenceOptions";

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
  const isFilled = (value?: string) => value != null && value.trim() !== "";
  return (
    stage.lifeStageRangeId != null &&
    stage.lifeStageRangeId > 0 &&
    isFilled(stage.annualSaving) &&
    isFilled(stage.currency) &&
    isFilled(stage.growthRate)
  );
}

function isAssetComplete(asset: Asset): boolean {
  const isFilled = (value?: string) => value != null && value.trim() !== "";
  return Boolean(
    asset.assetTypeId &&
    isFilled(asset.initialAnnualIncome) &&
    isFilled(asset.growthRate),
  );
}

function areValuesEqual<T>(left: T, right: T): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function areStagesMeaningfullyEqual(left: Stage[], right: Stage[]): boolean {
  return (
    JSON.stringify(
      left.map((stage) => ({
        lifeStageRangeId: stage.lifeStageRangeId ?? 0,
        annualSaving: stage.annualSaving,
        growthRate: stage.growthRate,
      })),
    ) ===
    JSON.stringify(
      right.map((stage) => ({
        lifeStageRangeId: stage.lifeStageRangeId ?? 0,
        annualSaving: stage.annualSaving,
        growthRate: stage.growthRate,
      })),
    )
  );
}

function hasFinancialResourceData(
  financial: UserInfoFinancialResource | null | undefined,
): boolean {
  if (!financial) {
    return false;
  }

  const hasFinancialProfile =
    financial.financialProfile != null &&
    (financial.financialProfile.currentSavings != null ||
      financial.financialProfile.desiredLifeExpectancy != null ||
      financial.financialProfile.currencyId != null);

  const hasPortfolioAllocations =
    (financial.portfolioAllocations?.length ?? 0) > 0;

  const hasLifestyleProfile =
    financial.lifestyleProfile != null &&
    Object.values(financial.lifestyleProfile).some(Boolean);

  return hasFinancialProfile || hasPortfolioAllocations || hasLifestyleProfile;
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
  const { data: userContext, set: setUserContext, refresh: refreshUserContext } =
    useUserContext();
  const registrationBirthYear =
    userContext?.birthYear == null ? "" : String(userContext.birthYear);
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
  const [personalDraft, setPersonalDraft] = useState<{
    name: string;
    birthYear: string;
    countryId: string;
    sexTypeId: string;
  } | null>(null);

  const [financialQuery, stagesQuery, assetsQuery] = useQueries({
    queries: [
      {
        queryKey: ["user-info", "financial"],
        queryFn: () => userInfoService.getFinancial(),
      },
      {
        queryKey: ["user-info", "stages"],
        queryFn: () => userInfoService.getStages(),
      },
      {
        queryKey: ["user-info", "assets"],
        queryFn: () => userInfoService.getAssets(),
      },
    ],
  });
  const lifeStageRangesQuery = useLifeStageRangesQuery(registrationBirthYear);

  const createFinancialMutation = useMutation({
    mutationFn: userInfoService.createFinancial,
  });
  const patchFinancialMutation = useMutation({
    mutationFn: userInfoService.patchFinancial,
  });
  const createStagesMutation = useMutation({
    mutationFn: userInfoService.createStages,
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
  const patchMeMutation = useMutation({
    mutationFn: userInfoService.patchMe,
  });

  const baseFinancialData = useMemo(
    () =>
      mapUserInfoResourcesToFinancialData({
        financial: financialQuery.data,
        stages: stagesQuery.data,
        assets: assetsQuery.data,
      }),
    [assetsQuery.data, financialQuery.data, stagesQuery.data],
  );

  const safeBaseFinancialData =
    baseFinancialData.stages.length === 0 &&
    baseFinancialData.assets.length === 0 &&
    !baseFinancialData.savings &&
    !baseFinancialData.currency &&
    !baseFinancialData.desiredLE &&
    !baseFinancialData.estimatedLE
      ? EMPTY_FINANCIAL_DATA
      : baseFinancialData;

  const preferredCurrencyFallback =
    userContext?.preferredCurrencyId != null
      ? String(userContext.preferredCurrencyId)
      : "";
  const effectiveBaseCurrency =
    safeBaseFinancialData.currency || preferredCurrencyFallback;

  const currentProfile = profileDraft ?? {
    estimatedLE: safeBaseFinancialData.estimatedLE,
    savings: safeBaseFinancialData.savings,
    currency: effectiveBaseCurrency,
    desiredLE: safeBaseFinancialData.desiredLE,
  };
  const currentAllocation = allocationDraft ?? safeBaseFinancialData.allocation;
  const currentHabits = habitsDraft ?? safeBaseFinancialData.habits;
  const currentStages = useMemo(() => {
    const sourceStages = stagesDraft ?? safeBaseFinancialData.stages;
    const stageCurrency = resolveCurrencyCode(
      references.currencies,
      currentProfile.currency || effectiveBaseCurrency,
    );

    if (!lifeStageRangesQuery.data?.length) {
      return sourceStages.map((stage) => ({
        ...stage,
        currency: stageCurrency || stage.currency,
      }));
    }

    return buildAccountStagesFromRanges(
      lifeStageRangesQuery.data,
      sourceStages,
      stageCurrency,
    );
  }, [
    currentProfile.currency,
    lifeStageRangesQuery.data,
    references.currencies,
    effectiveBaseCurrency,
    safeBaseFinancialData.stages,
    stagesDraft,
  ]);
  const currentAssets = assetsDraft ?? safeBaseFinancialData.assets;

  const hasPersistedFinancial = hasFinancialResourceData(financialQuery.data);
  const hasPersistedStages = (stagesQuery.data?.length ?? 0) > 0;

  const isLoading =
    financialQuery.isLoading || stagesQuery.isLoading || assetsQuery.isLoading;
  const isSavingFinancial =
    createFinancialMutation.isPending || patchFinancialMutation.isPending;
  const isSavingStages =
    patchStagesMutation.isPending || createStagesMutation.isPending;
  const isSavingAssets =
    createAssetsMutation.isPending ||
    patchAssetsMutation.isPending ||
    deleteAssetMutation.isPending;
  const isSavingPersonal = patchMeMutation.isPending;
  const pageError =
    sectionError ??
    (financialQuery.error instanceof Error
      ? financialQuery.error.message
      : null) ??
    (stagesQuery.error instanceof Error ? stagesQuery.error.message : null) ??
    (assetsQuery.error instanceof Error ? assetsQuery.error.message : null) ??
    references.error ??
    (lifeStageRangesQuery.error instanceof Error
      ? lifeStageRangesQuery.error.message
      : null);

  const basePersonal = {
    name: userContext?.name ?? "",
    birthYear:
      userContext?.birthYear == null ? "" : String(userContext.birthYear),
    countryId:
      userContext?.countryId == null ? "" : String(userContext.countryId),
    sexTypeId:
      userContext?.sexTypeId == null ? "" : String(userContext.sexTypeId),
  };
  const currentPersonal = personalDraft ?? basePersonal;
  const hasPersonalChanges = !areValuesEqual(currentPersonal, basePersonal);
  const canSavePersonal =
    Boolean(
      currentPersonal.name.trim() &&
        currentPersonal.birthYear &&
        currentPersonal.countryId &&
        currentPersonal.sexTypeId,
    ) &&
    hasPersonalChanges &&
    !isSavingPersonal;

  const hasFinancialChanges =
    !areValuesEqual(currentProfile, {
      estimatedLE: safeBaseFinancialData.estimatedLE,
      savings: safeBaseFinancialData.savings,
      currency: safeBaseFinancialData.currency,
      desiredLE: safeBaseFinancialData.desiredLE,
    }) ||
    !areValuesEqual(currentAllocation, safeBaseFinancialData.allocation) ||
    !areValuesEqual(currentHabits, safeBaseFinancialData.habits);

  const canSaveFinancial =
    Boolean(
      currentProfile.savings &&
      currentProfile.currency &&
      currentProfile.desiredLE &&
      (["before", "after"] as const).every((period) =>
        (["u", "mu", "rf"] as const).every((key) =>
          Boolean(currentAllocation[period][key]),
        ),
      ),
    ) &&
    (Object.keys(currentHabits) as Array<keyof Habits>).every((key) =>
      Boolean(currentHabits[key]),
    ) &&
    hasFinancialChanges &&
    !isSavingFinancial &&
    !references.isLoading;

  const newAssets = currentAssets.filter((asset) => !asset.uid);
  const changedPersistedAssets = getChangedPersistedAssets(
    currentAssets,
    safeBaseFinancialData.assets,
  );
  const canSaveStages =
    currentStages.length > 0 &&
    currentStages.every(isStageComplete) &&
    !areStagesMeaningfullyEqual(currentStages, safeBaseFinancialData.stages) &&
    !isSavingStages;
  const canSaveAssets =
    currentAssets.every(isAssetComplete) &&
    (newAssets.length > 0 || changedPersistedAssets.length > 0) &&
    !isSavingAssets &&
    !references.isLoading;

  async function refreshUserInfoData() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["user-info", "financial"] }),
      queryClient.invalidateQueries({ queryKey: ["user-info", "stages"] }),
      queryClient.invalidateQueries({ queryKey: ["user-info", "assets"] }),
    ]);
  }

  async function handleSavePersonal() {
    setSectionError(null);

    try {
      const next = await patchMeMutation.mutateAsync({
        userInfo: {
          name: currentPersonal.name.trim(),
          birthYear: Number(currentPersonal.birthYear),
          countryId: Number(currentPersonal.countryId),
          sexTypeId: Number(currentPersonal.sexTypeId),
        },
      });

      setUserContext(next);
      await refreshUserContext();
      setPersonalDraft(null);
      await refreshUserInfoData();
    } catch (error) {
      setSectionError(
        error instanceof Error
          ? error.message
          : "Unable to update personal information.",
      );
    }
  }

  async function handleSaveFinancial() {
    setSectionError(null);
    try {
      const payload = buildFinancialRequestFromFinancialData(
        currentProfile,
        currentAllocation,
        currentHabits,
      );
      if (hasPersistedFinancial) {
        await patchFinancialMutation.mutateAsync(payload);
      } else {
        await createFinancialMutation.mutateAsync(payload);
      }
      setProfileDraft(null);
      setAllocationDraft(null);
      setHabitsDraft(null);
      await refreshUserInfoData();
    } catch (error) {
      setSectionError(
        error instanceof Error
          ? error.message
          : "Unable to update financial information.",
      );
    }
  }

  async function handleSaveStages() {
    setSectionError(null);
    try {
      const payload = buildStagesRequest(currentStages);
      if (hasPersistedStages) {
        await patchStagesMutation.mutateAsync(payload);
      } else {
        await createStagesMutation.mutateAsync(payload);
      }
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
        const sourceAssets = prev ?? safeBaseFinancialData.assets;
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
      <Card
        hoverable={false}
        className="w-full rounded-xl bg-white p-6 shadow-md"
      >
        <h2 className="text-2xl font-bold text-primary">
          Personal Information
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Loading your detailed information...
        </p>
      </Card>
    );
  }

  return (
    <Card
      hoverable={false}
      className="w-full rounded-xl bg-white p-6 shadow-md"
    >
      <h2 className="text-2xl font-bold text-primary">Personal Information</h2>
      {/* <p className="mt-1 text-sm text-muted-foreground">
        Manage your general information life expectancy, savings, investment portfolio, lifestyle,
        life stages, and post-FFP asset profiles.
      </p> */}
      {pageError ? (
        <p className="mt-4 text-sm font-semibold text-red-600">{pageError}</p>
      ) : null}

      <div className="mt-6 space-y-6">
        <GeneralInformationForm
          value={currentPersonal}
          countryOptions={references.countryOptions}
          sexTypeOptions={references.sexTypeOptions}
          canSave={canSavePersonal}
          isSaving={isSavingPersonal}
          onChange={(next) => setPersonalDraft(next)}
          onSave={handleSavePersonal}
        />

        <div className="space-y-4">
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
            canSave={canSaveFinancial}
            isSaving={isSavingFinancial}
            onSave={handleSaveFinancial}
            onProfileChange={(field, value) => {
              setProfileDraft((prev) => ({
                ...(prev ?? {
                  estimatedLE: safeBaseFinancialData.estimatedLE,
                  savings: safeBaseFinancialData.savings,
                  currency: effectiveBaseCurrency,
                  desiredLE: safeBaseFinancialData.desiredLE,
                }),
                [field]: value,
              }));
            }}
            onAllocationChange={(period, key, value) => {
              setAllocationDraft((prev) => ({
                ...(prev ?? safeBaseFinancialData.allocation),
                [period]: {
                  ...(prev ?? safeBaseFinancialData.allocation)[period],
                  [key]: value,
                },
              }));
            }}
            onHabitChange={(key, value) => {
              setHabitsDraft((prev) => ({
                ...(prev ?? safeBaseFinancialData.habits),
                [key]: value,
              }));
            }}
          />
        </div>

        <div className="rounded-xl border border-border bg-slate-50 p-4">
          <h3 className="text-base font-semibold text-slate-900">
            Life Stages
          </h3>
          <p className="mt-1 text-xs italic text-slate-600">
            Includes salary, rental income, and other savings contributions
            before Financial Freedom Point.
          </p>
          <div className="mt-4 max-h-96 space-y-4 overflow-y-auto pr-2">
            {!lifeStageRangesQuery.isLoading && currentStages.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Life stages will appear here once your registration birth year
                is available.
              </p>
            ) : null}
            {currentStages.map((stage, index) => (
              <StageEditorCard
                key={`stage_${stage.lifeStageRangeId ?? index}`}
                variant="account"
                stage={toStageEditorValue(stage)}
                index={index}
                onChange={(next) =>
                  setStagesDraft((prev) => {
                    const sourceStages = prev ?? currentStages;
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
          <h3 className="text-base font-semibold text-slate-900">
            Post-FFP Assets
          </h3>
          <p className="mt-1 text-xs italic text-slate-600">
            Includes passive income sources after Financial Freedom Point, such
            as rental income and pensions.
          </p>
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setAssetsDraft((prev) => [
                  ...(prev ?? safeBaseFinancialData.assets),
                  createEmptyAsset(),
                ])
              }
              className="text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:text-slate-400"
              disabled={
                references.isLoading || references.assetTypeOptions.length === 0
              }
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
                      const sourceAssets = prev ?? safeBaseFinancialData.assets;
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
