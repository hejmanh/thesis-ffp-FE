"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import AnimatedPanel from "@/components/common/AnimatedPanel";
import Button from "@/components/common/Button";
import RegistrationProgressBar from "@/components/register/progress/RegistrationProgressBar";
import Step2PersonalForm from "@/components/register/steps/Step2PersonalForm";
import Step3StagesCards from "@/components/register/steps/Step3StagesCards";
import Step4AssetsCards from "@/components/register/steps/Step4AssetsCards";
import { useLifeStageRangesQuery, useOnboardingReferences } from "@/hooks";
import { useUserContext } from "@/providers/UserContextProvider";
import { tokenService } from "@/services/token.service";
import { userInfoService } from "@/services/userInfo.service";
import { useAuthStore } from "@/store/auth.store";
import type { OnboardingDraft } from "@/types/onboarding";
import {
  isAssetComplete,
  isStageComplete,
  validateStep2,
} from "@/utils/onboardingValidators";
import { canAccessOnboardingSteps } from "@/utils/onboardingGuard";
import {
  clearOnboardingState,
  loadOnboardingState,
  saveOnboardingState,
} from "@/utils/onboardingStorage";
import {
  buildCreateAssetsRequest,
  buildCreateFinancialRequestFromOnboarding,
  buildStageItemsFromRanges,
  buildStagesRequest,
} from "@/utils/userInfoMappers";
import { resolveCurrencyCode } from "@/utils/referenceOptions";

const ONBOARDING_STEPS = ["Personal Information", "Stages Data", "Asset Data"];

export default function RegisterWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<OnboardingDraft>(loadOnboardingState);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [completed, setCompleted] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: userContext } = useUserContext();

  useEffect(() => {
    if (isAuthenticated || !tokenService.get()) {
      return;
    }

    if (draft.step1.email) {
      useAuthStore.getState().setUser({
        email: draft.step1.email,
        name: draft.step1.name || undefined,
      });
      return;
    }

    useAuthStore.getState().setAuthenticated(true);
  }, [draft.step1.email, draft.step1.name, isAuthenticated]);

  const onboardingReferences = useOnboardingReferences();
  const lifeStageRangesQuery = useLifeStageRangesQuery(draft.step1.birthYear);
  const preferredCurrencyFallback =
    userContext?.preferredCurrencyId != null
      ? String(userContext.preferredCurrencyId)
      : "";
  const step2Data =
    draft.step2.preferredCurrency || !preferredCurrencyFallback
      ? draft.step2
      : {
          ...draft.step2,
          preferredCurrency: preferredCurrencyFallback,
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

  useEffect(() => {
    if (completed) {
      return;
    }

    saveOnboardingState(draft);
  }, [completed, draft]);

  async function handlePersonalNext() {
    setError("");
    const nextDraft = getDraftWithEstimatedLifeExpectancy(draft);
    if (onboardingReferences.error) {
      setError(onboardingReferences.error);
      return;
    }
    if (!lifeStageRangesQuery.enabled) {
      setError(
        "A valid birth year is required to continue. Please go back and update your account details.",
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
      clearOnboardingState();
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

  const stepContent = completed ? (
    <div className="py-16 text-center">
      <h2 className="text-4xl font-bold text-primary">Onboarding Complete</h2>
      <p className="mt-4 text-md text-muted-foreground">
        Your profile has been saved. You can now proceed to scenarios and
        planning tools.
      </p>
      <div className="mt-8 flex justify-center">
        <Button
          className="h-12 rounded-full px-8 text-base"
          onClick={() => router.push("/account")}
        >
          Start Your Financial Journey
        </Button>
      </div>
    </div>
  ) : step === 1 ? (
    <Step2PersonalForm
      data={step2Data}
      estimatedLifeExpectancy={
        draft.step2.estimatedLifeExpectancy ||
        onboardingReferences.estimatedLifeExpectancy
      }
      currencyOptions={onboardingReferences.currencyOptions}
      smokingOptions={onboardingReferences.smokingOptions}
      physicalActivityOptions={onboardingReferences.physicalActivityOptions}
      dietQualityOptions={onboardingReferences.dietQualityOptions}
      alcoholConsumptionOptions={onboardingReferences.alcoholConsumptionOptions}
      error={error}
      referenceError={onboardingReferences.error}
      isReferenceLoading={onboardingReferences.isLoading}
      isSubmitting={saving}
      onNext={handlePersonalNext}
      onChange={(next) => setDraft((prev) => ({ ...prev, step2: next }))}
    />
  ) : step === 2 ? (
    <Step3StagesCards
      stages={draft.stages}
      error={error}
      isSubmitting={saving}
      onBack={() => setStep(1)}
      onNext={handleStagesNext}
      onChange={(stages) => setDraft((prev) => ({ ...prev, stages }))}
    />
  ) : (
    <Step4AssetsCards
      assets={draft.assets}
      assetTypeOptions={onboardingReferences.assetTypeOptions}
      error={error}
      referenceError={onboardingReferences.error}
      isReferenceLoading={onboardingReferences.isLoading}
      isSubmitting={saving}
      onBack={() => setStep(2)}
      onSubmit={handleAssetsSubmit}
      onChange={(assets) => setDraft((prev) => ({ ...prev, assets }))}
    />
  );

  const transitionKey = completed ? "completed" : `step-${step}`;

  return (
    <div className="relative mx-auto max-w-3xl rounded-3xl bg-slate-50 p-6 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.4)] sm:p-8 lg:p-10">
      {!completed ? (
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto rounded-lg px-0 py-0 text-sm font-semibold"
            disabled={saving}
            onClick={() => router.push("/account")}
          >
            <Icon icon="ic:round-skip-previous" className="h-4 w-4" />
            Skip
          </Button>
          <p className="mt-2 ml-4 text-xs text-muted-foreground">
            * You can skip this setup for now and complete it later from the
            account page.
          </p>
        </div>
      ) : null}
      <RegistrationProgressBar steps={ONBOARDING_STEPS} currentStep={step} />
      <AnimatedPanel key={transitionKey}>{stepContent}</AnimatedPanel>

      {toastMessage ? (
        <div className="fixed right-6 top-6 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}
