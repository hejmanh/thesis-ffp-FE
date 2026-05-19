"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AnimatedPanel from "@/components/common/AnimatedPanel";
import RegistrationProgressBar from "@/components/register/progress/RegistrationProgressBar";
import Step2PersonalForm from "@/components/register/steps/Step2PersonalForm";
import Step3StagesCards from "@/components/register/steps/Step3StagesCards";
import Step4AssetsCards from "@/components/register/steps/Step4AssetsCards";
import { tokenService } from "@/services/token.service";
import { useAuthStore } from "@/store/auth.store";
import type { OnboardingDraft } from "@/types/onboarding";
import {
  INITIAL_ONBOARDING_DRAFT,
  ONBOARDING_REGISTRATION_GATE_KEY,
  ONBOARDING_STORAGE_KEY,
} from "@/utils/onboardingConstants";
import { isAssetComplete, validateStep2 } from "@/utils/onboardingValidators";
import { canAccessOnboardingSteps } from "@/utils/onboardingGuard";
import { buildHardcodedStageItems } from "@/utils/stageDefaults";

const ONBOARDING_STEPS = ["Personal Information", "Stages Data", "Asset Data"];

function readOnboardingDraft(): OnboardingDraft {
  if (typeof window === "undefined") {
    return INITIAL_ONBOARDING_DRAFT;
  }

  const rawDraft = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
  if (!rawDraft) {
    return INITIAL_ONBOARDING_DRAFT;
  }

  try {
    const parsedDraft = JSON.parse(rawDraft) as Partial<OnboardingDraft>;

    return {
      step1: {
        ...INITIAL_ONBOARDING_DRAFT.step1,
        ...parsedDraft.step1,
      },
      step2: {
        ...INITIAL_ONBOARDING_DRAFT.step2,
        ...parsedDraft.step2,
        beforeFfp: {
          ...INITIAL_ONBOARDING_DRAFT.step2.beforeFfp,
          ...parsedDraft.step2?.beforeFfp,
        },
        afterFfp: {
          ...INITIAL_ONBOARDING_DRAFT.step2.afterFfp,
          ...parsedDraft.step2?.afterFfp,
        },
        habits: {
          ...INITIAL_ONBOARDING_DRAFT.step2.habits,
          ...parsedDraft.step2?.habits,
        },
      },
      stages: parsedDraft.stages ?? INITIAL_ONBOARDING_DRAFT.stages,
      assets: parsedDraft.assets ?? INITIAL_ONBOARDING_DRAFT.assets,
    };
  } catch {
    return INITIAL_ONBOARDING_DRAFT;
  }
}

function hasRegistrationAccess(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.sessionStorage.getItem(ONBOARDING_REGISTRATION_GATE_KEY) === "true"
  );
}

export default function RegisterWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<OnboardingDraft>(readOnboardingDraft);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [completed, setCompleted] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (
      !canAccessOnboardingSteps({
        isAuthenticated,
        hasAccessToken: Boolean(tokenService.get()),
        hasRegistrationAccess: hasRegistrationAccess(),
      })
    ) {
      router.replace("/?login=1");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, completed]);

  function handlePersonalNext() {
    setError("");
    const validation = validateStep2(draft.step2);
    if (validation) {
      setError(validation);
      return;
    }
    const generatedStages = buildHardcodedStageItems(draft.stages, draft.step2.preferredCurrency);
    setDraft((prev) => ({ ...prev, stages: generatedStages }));
    setStep(2);
  }

  function handleStagesNext() {
    setStep(3);
  }

  async function handleAssetsSubmit() {
    setError("");
    if (!draft.assets.length || !draft.assets.every(isAssetComplete)) {
      setError("Please add at least one complete asset card.");
      return;
    }
    setSaving(true);
    setToastMessage("Saving onboarding data...");
    await new Promise((resolve) => setTimeout(resolve, 700));
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(draft));
      window.sessionStorage.removeItem(ONBOARDING_REGISTRATION_GATE_KEY);
    }
    setToastMessage("");
    setSaving(false);
    setCompleted(true);
  }

  const stepContent = completed ? (
    <div className="py-16 text-center">
      <h2 className="text-4xl font-bold text-primary">Onboarding Complete</h2>
      <p className="mt-4 text-lg text-muted-foreground">
        Your profile has been saved. You can now proceed to scenarios and planning tools.
      </p>
    </div>
  ) : step === 1 ? (
    <Step2PersonalForm
      data={draft.step2}
      error={error}
      onNext={handlePersonalNext}
      onChange={(next) => setDraft((prev) => ({ ...prev, step2: next }))}
    />
  ) : step === 2 ? (
    <Step3StagesCards
      stages={draft.stages}
      error={error}
      onBack={() => setStep(1)}
      onNext={handleStagesNext}
      onChange={(stages) => setDraft((prev) => ({ ...prev, stages }))}
    />
  ) : (
    <Step4AssetsCards
      assets={draft.assets}
      error={error}
      isSubmitting={saving}
      onBack={() => setStep(2)}
      onSubmit={handleAssetsSubmit}
      onChange={(assets) => setDraft((prev) => ({ ...prev, assets }))}
    />
  );

  const transitionKey = completed ? "completed" : `step-${step}`;

  return (
    <div className="relative mx-auto max-w-3xl rounded-3xl bg-slate-50 p-6 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.4)] sm:p-8 lg:p-10">
      <RegistrationProgressBar steps={ONBOARDING_STEPS} currentStep={step} />
      <AnimatedPanel key={transitionKey}>
        {stepContent}
      </AnimatedPanel>

      {toastMessage ? (
        <div className="fixed right-6 top-6 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}
