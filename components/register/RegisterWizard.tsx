"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RegistrationProgressBar from "@/components/register/progress/RegistrationProgressBar";
import Step2PersonalForm from "@/components/register/steps/Step2PersonalForm";
import Step3StagesCards from "@/components/register/steps/Step3StagesCards";
import Step4AssetsCards from "@/components/register/steps/Step4AssetsCards";
import { getSession } from "@/services/auth/mockAuth";
import type { OnboardingDraft } from "@/types/onboarding";
import { INITIAL_ONBOARDING_DRAFT } from "@/utils/onboardingConstants";
import { isAssetComplete, validateStep2 } from "@/utils/onboardingValidators";
import { canAccessOnboardingSteps } from "@/utils/onboardingGuard";
import { buildHardcodedStageItems } from "@/utils/stageDefaults";

const ONBOARDING_STORAGE_KEY = "coinfused_onboarding_payload";
const ONBOARDING_STEPS = ["Personal Information", "Stages Data", "Asset Data"];

export default function RegisterWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<OnboardingDraft>(INITIAL_ONBOARDING_DRAFT);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!canAccessOnboardingSteps(getSession())) {
      router.replace("/?login=1");
    }
  }, [router]);

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
    }
    setToastMessage("");
    setSaving(false);
    setCompleted(true);
  }

  return (
    <div className="relative mx-auto max-w-6xl rounded-3xl bg-slate-50 p-6 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.4)] sm:p-8 lg:p-10">
      <RegistrationProgressBar steps={ONBOARDING_STEPS} currentStep={step} />
      {completed ? (
        <div className="py-16 text-center">
          <h2 className="text-4xl font-bold text-primary">Onboarding Complete</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Your profile has been saved. You can now proceed to scenarios and planning tools.
          </p>
        </div>
      ) : null}

      {!completed && step === 1 ? (
        <Step2PersonalForm
          data={draft.step2}
          error={error}
          onNext={handlePersonalNext}
          onChange={(next) => setDraft((prev) => ({ ...prev, step2: next }))}
        />
      ) : null}
      {!completed && step === 2 ? (
        <Step3StagesCards
          stages={draft.stages}
          error={error}
          onBack={() => setStep(1)}
          onNext={handleStagesNext}
          onChange={(stages) => setDraft((prev) => ({ ...prev, stages }))}
        />
      ) : null}
      {!completed && step === 3 ? (
        <Step4AssetsCards
          assets={draft.assets}
          error={error}
          isSubmitting={saving}
          onBack={() => setStep(2)}
          onSubmit={handleAssetsSubmit}
          onChange={(assets) => setDraft((prev) => ({ ...prev, assets }))}
        />
      ) : null}

      {toastMessage ? (
        <div className="fixed right-6 top-6 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}
