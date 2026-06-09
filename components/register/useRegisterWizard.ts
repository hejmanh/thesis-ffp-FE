"use client";

import { useEffect, useState } from "react";
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
import { useLocaleRouter, useTranslations } from "@/i18n/client";

function didLifestyleChange(
  current: OnboardingDraft["step2"]["habits"],
  next: OnboardingDraft["step2"]["habits"],
): boolean {
  return (
    current.smoke !== next.smoke ||
    current.physical !== next.physical ||
    current.diet !== next.diet ||
    current.alcohol !== next.alcohol
  );
}

export function useRegisterWizard() {
  const router = useLocaleRouter();
  const steps = useTranslations("Register.steps");
  const toast = useTranslations("Register.toast");
  const errors = useTranslations("Register.errors");
  const validationT = useTranslations("Validation");
  const onboardingSteps = [
    steps("generalInformation"),
    steps("lifeStages"),
    steps("postFfpAssets"),
  ];
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
      setError(errors("loadingContext"));
      return;
    }
    if (userContextError) {
      setError(userContextError);
      return;
    }
    if (!hasRegistrationBirthYear) {
      setError(
        errors("missingBirthYear"),
      );
      return;
    }
    if (!lifeStageRangesQuery.enabled) {
      setError(
        errors("invalidBirthYear"),
      );
      return;
    }
    if (lifeStageRangesQuery.isLoading) {
      setError(errors("loadingLifeStages"));
      return;
    }
    if (lifeStageRangesQuery.error instanceof Error) {
      setError(lifeStageRangesQuery.error.message);
      return;
    }
    if (!lifeStageRangesQuery.data?.length) {
      setError(
        errors("noLifeStages"),
      );
      return;
    }
    const validation = validateStep2(nextDraft.step2);
    if (validation) {
      setError(validationT("generalInformationIncomplete"));
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
    setToastMessage(toast("savingFinancial"));
    try {
      const payload = buildCreateFinancialRequestFromOnboarding(nextDraft);
      await userInfoService.upsertFinancial(payload);
      setDraft({ ...nextDraft, stages: generatedStages });
      setStep(2);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : errors("saveFinancial"),
      );
    } finally {
      setToastMessage("");
      setSaving(false);
    }
  }

  async function handleStagesNext() {
    setError("");
    if (!draft.stages.length || !draft.stages.every(isStageComplete)) {
      setError(errors("completeStageData"));
      return;
    }

    setSaving(true);
    setToastMessage(toast("savingStages"));
    try {
      const payload = buildStagesRequest(draft.stages);
      await userInfoService.upsertStages(payload);
      setStep(3);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : errors("saveStages"),
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
      setError(validationT("generalInformationIncomplete"));
      return;
    }
    if (!nextDraft.stages.length || !nextDraft.stages.every(isStageComplete)) {
      setError(errors("completeStageDataSubmit"));
      return;
    }
    if (
      nextDraft.assets.length > 0 &&
      !nextDraft.assets.every(isAssetComplete)
    ) {
      setError(errors("completeAssets"));
      return;
    }
    setSaving(true);
    setToastMessage(toast("savingAssets"));
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
          : errors("completeOnboarding"),
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
    onboardingSteps,
    onboardingReferences,
    isUserContextLoading,
    step2Data,
    estimatedLifeExpectancy:
      draft.step2.estimatedLifeExpectancy ||
      onboardingReferences.estimatedLifeExpectancy,
    goToAccount: () => router.push("/profile"),
    goToStep: setStep,
    updateStep2: (step2: OnboardingDraft["step2"]) => {
      const lifestyleChanged = didLifestyleChange(draft.step2.habits, step2.habits);
      setDraft((prev) => ({
        ...prev,
        step2: lifestyleChanged
          ? { ...step2, estimatedLifeExpectancy: "" }
          : step2,
      }));

      if (lifestyleChanged) {
        void refreshUserContext();
      }
    },
    updateStages: (stages: OnboardingDraft["stages"]) =>
      setDraft((prev) => ({ ...prev, stages })),
    updateAssets: (assets: OnboardingDraft["assets"]) =>
      setDraft((prev) => ({ ...prev, assets })),
    handlePersonalNext,
    handleStagesNext,
    handleAssetsSubmit,
  };
}
