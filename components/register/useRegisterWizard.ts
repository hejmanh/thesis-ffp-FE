"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLifeStageRangesQuery, useOnboardingReferences } from "@/hooks";
import { canAccessOnboardingSteps } from "@/guards/onboardingGuard";
import { useUserContext } from "@/providers/UserContextProvider";
import { tokenService } from "@/services/token.service";
import { userInfoService } from "@/services/userInfo.service";
import { useAuthStore } from "@/store/auth.store";
import { createEmptyOnboardingState } from "@/store/onboardingStorage";
import type { OnboardingDraft } from "@/types/onboarding";
import {
  buildCreateAssetsRequest,
  buildCreateFinancialRequestFromOnboarding,
  buildStageItemsFromRanges,
  buildStagesRequest,
} from "@/utils/userInfoMappers";
import {
  isAssetComplete,
  isStageComplete,
  validateStep2,
} from "@/utils/onboardingValidators";
import { resolveCurrencyCode } from "@/utils/referenceOptions";

export const ONBOARDING_STEPS = [
  "Personal Information",
  "Stages Data",
  "Asset Data",
];

export function useRegisterWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<OnboardingDraft>(
    createEmptyOnboardingState,
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [completed, setCompleted] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const {
    data: userContext,
    isLoading: isUserContextLoading,
    error: userContextError,
    refresh: refreshUserContext,
  } = useUserContext();

  const onboardingReferences = useOnboardingReferences();
  const registrationBirthYear =
    userContext?.birthYear == null ? "" : String(userContext.birthYear);
  const hasRegistrationBirthYear = registrationBirthYear.trim() !== "";
  const lifeStageRangesQuery = useLifeStageRangesQuery(registrationBirthYear);
  const preferredCurrencyFallback =
    userContext?.preferredCurrencyId != null
      ? String(userContext.preferredCurrencyId)
      : "";
  const preferredCurrencyDefault =
    onboardingReferences.currencyOptions.find(
      (option) => option.value === preferredCurrencyFallback,
    )?.value ?? "";
  const step2Data =
    draft.step2.preferredCurrency || !preferredCurrencyDefault
      ? draft.step2
      : {
          ...draft.step2,
          preferredCurrency: preferredCurrencyDefault,
        };

  function getDraftWithEstimatedLifeExpectancy(
    sourceDraft: OnboardingDraft,
  ): OnboardingDraft {
    const preferredCurrencyId = userContext?.preferredCurrencyId;
    const preferredCurrency =
      sourceDraft.step2.preferredCurrency ||
      (preferredCurrencyId != null ? String(preferredCurrencyId) : "");

    if (
      (!onboardingReferences.estimatedLifeExpectancy &&
        preferredCurrency === sourceDraft.step2.preferredCurrency) ||
      sourceDraft.step2.estimatedLifeExpectancy ===
        onboardingReferences.estimatedLifeExpectancy
    ) {
      return preferredCurrency === sourceDraft.step2.preferredCurrency
        ? sourceDraft
        : {
            ...sourceDraft,
            step2: {
              ...sourceDraft.step2,
              preferredCurrency,
            },
          };
    }

    return {
      ...sourceDraft,
      step2: {
        ...sourceDraft.step2,
        estimatedLifeExpectancy: onboardingReferences.estimatedLifeExpectancy,
        preferredCurrency,
      },
    };
  }

  useEffect(() => {
    if (isAuthenticated || !tokenService.get()) {
      return;
    }

    useAuthStore.getState().setAuthenticated(true);
  }, [isAuthenticated]);

  useEffect(() => {
    if (
      !isAuthenticated ||
      isUserContextLoading ||
      userContextError ||
      userContext ||
      !tokenService.get()
    ) {
      return;
    }

    void refreshUserContext();
  }, [
    isAuthenticated,
    isUserContextLoading,
    refreshUserContext,
    userContext,
    userContextError,
  ]);

  useEffect(() => {
    if (
      !canAccessOnboardingSteps({
        isAuthenticated,
        hasAccessToken: Boolean(tokenService.get()),
      })
    ) {
      router.replace("/?login=1");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, completed]);

  async function handlePersonalNext() {
    setError("");
    const nextDraft = getDraftWithEstimatedLifeExpectancy(draft);
    if (onboardingReferences.error) {
      setError(onboardingReferences.error);
      return;
    }
    if (isUserContextLoading) {
      setError("Loading your account context, please wait...");
      return;
    }
    if (userContextError) {
      setError(userContextError);
      return;
    }
    if (!hasRegistrationBirthYear) {
      setError(
        "Your account context does not include a birth year. Please update your account information before continuing onboarding.",
      );
      return;
    }
    if (!lifeStageRangesQuery.enabled) {
      setError(
        "A valid birth year is required to continue.",
      );
      return;
    }
    if (lifeStageRangesQuery.isLoading) {
      setError("Loading life stage ranges, please wait...");
      return;
    }
    if (lifeStageRangesQuery.error instanceof Error) {
      setError(lifeStageRangesQuery.error.message);
      return;
    }
    if (!lifeStageRangesQuery.data?.length) {
      setError(
        "No life stage ranges are available for the selected birth year.",
      );
      return;
    }
    const validation = validateStep2(nextDraft.step2);
    if (validation) {
      setError(validation);
      return;
    }

    const generatedStages = buildStageItemsFromRanges(
      lifeStageRangesQuery.data,
      nextDraft.stages,
      resolveCurrencyCode(
        onboardingReferences.currencies,
        nextDraft.step2.preferredCurrency,
      ),
    );

    setSaving(true);
    setToastMessage("Saving your financial information...");
    try {
      const payload = buildCreateFinancialRequestFromOnboarding(nextDraft);
      await userInfoService.createFinancial(payload);
      setDraft({ ...nextDraft, stages: generatedStages });
      setStep(2);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save financial information.",
      );
    } finally {
      setToastMessage("");
      setSaving(false);
    }
  }

  async function handleStagesNext() {
    setError("");
    if (!draft.stages.length || !draft.stages.every(isStageComplete)) {
      setError("Please complete your stage data before continuing.");
      return;
    }

    setSaving(true);
    setToastMessage("Saving your stage information...");
    try {
      const payload = buildStagesRequest(draft.stages);
      await userInfoService.createStages(payload);
      setStep(3);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save stages.",
      );
    } finally {
      setToastMessage("");
      setSaving(false);
    }
  }

  async function handleAssetsSubmit() {
    setError("");
    const nextDraft = getDraftWithEstimatedLifeExpectancy(draft);
    const validation = validateStep2(nextDraft.step2);
    if (validation) {
      setError(validation);
      return;
    }
    if (!nextDraft.stages.length || !nextDraft.stages.every(isStageComplete)) {
      setError("Please complete your stage data before submitting.");
      return;
    }
    if (
      nextDraft.assets.length > 0 &&
      !nextDraft.assets.every(isAssetComplete)
    ) {
      setError("Please complete each asset card before submitting.");
      return;
    }
    setSaving(true);
    setToastMessage("Saving your assets...");
    try {
      if (nextDraft.assets.length > 0) {
        const payload = buildCreateAssetsRequest(nextDraft.assets);
        await userInfoService.createAssets(payload);
      }
      setCompleted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to complete onboarding.",
      );
    } finally {
      setToastMessage("");
      setSaving(false);
    }
  }

  return {
    step,
    draft,
    error,
    saving,
    completed,
    toastMessage,
    onboardingReferences,
    isUserContextLoading,
    canContinuePersonalStep:
      !isUserContextLoading && !userContextError && hasRegistrationBirthYear,
    step2Data,
    estimatedLifeExpectancy:
      draft.step2.estimatedLifeExpectancy ||
      onboardingReferences.estimatedLifeExpectancy,
    goToAccount: () => router.push("/account"),
    goToStep: setStep,
    updateStep2: (step2: OnboardingDraft["step2"]) =>
      setDraft((prev) => ({ ...prev, step2 })),
    updateStages: (stages: OnboardingDraft["stages"]) =>
      setDraft((prev) => ({ ...prev, stages })),
    updateAssets: (assets: OnboardingDraft["assets"]) =>
      setDraft((prev) => ({ ...prev, assets })),
    handlePersonalNext,
    handleStagesNext,
    handleAssetsSubmit,
  };
}
