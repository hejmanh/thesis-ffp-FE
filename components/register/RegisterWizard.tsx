"use client";

import { useState } from "react";
import RegistrationProgressBar from "@/components/register/progress/RegistrationProgressBar";
import Step1AccountForm from "@/components/register/steps/Step1AccountForm";
import Step2PersonalForm from "@/components/register/steps/Step2PersonalForm";
import Step3StagesCards from "@/components/register/steps/Step3StagesCards";
import Step4AssetsCards from "@/components/register/steps/Step4AssetsCards";
import { autoLoginByEmail, registerStep1 } from "@/services/auth/mockAuth";
import type { OnboardingDraft, Step1AccountData } from "@/types/onboarding";
import { INITIAL_ONBOARDING_DRAFT } from "@/utils/onboardingConstants";
import { isAssetComplete, isStageComplete, validateStep1, validateStep2 } from "@/utils/onboardingValidators";

const ONBOARDING_STORAGE_KEY = "coinfused_onboarding_payload";
const REGISTRATION_STEPS = ["Registration", "Personal Information", "Stages Data", "Asset Data"];

export default function RegisterWizard() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<OnboardingDraft>(INITIAL_ONBOARDING_DRAFT);
  const [error, setError] = useState("");
  const [autoLoginLoading, setAutoLoginLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  function updateStep1Field<K extends keyof Step1AccountData>(key: K, value: Step1AccountData[K]) {
    setDraft((prev) => ({
      ...prev,
      step1: { ...prev.step1, [key]: value },
    }));
  }

  async function handleStep1Next() {
    setError("");
    const validation = validateStep1(draft.step1);
    if (validation) {
      setError(validation);
      return;
    }
    setAutoLoginLoading(true);
    try {
      await registerStep1({
        email: draft.step1.email,
        password: draft.step1.password,
        birthYear: Number(draft.step1.birthYear),
        country: draft.step1.country,
        sex: draft.step1.sex,
      });
      setToastMessage("Creating account and auto logging in...");
      await autoLoginByEmail(draft.step1.email);
      setToastMessage("");
      setStep(2);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to register.");
      setToastMessage("");
    } finally {
      setAutoLoginLoading(false);
    }
  }

  function handleStep2Next() {
    setError("");
    const validation = validateStep2(draft.step2);
    if (validation) {
      setError(validation);
      return;
    }
    setStep(3);
  }

  function handleStep3Next() {
    setError("");
    if (!draft.stages.length || !draft.stages.every(isStageComplete)) {
      setError("Please add at least one complete stage card.");
      return;
    }
    setStep(4);
  }

  async function handleStep4Submit() {
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
      <RegistrationProgressBar steps={REGISTRATION_STEPS} currentStep={step} />
      {completed ? (
        <div className="py-16 text-center">
          <h2 className="text-4xl font-bold text-primary">Onboarding Complete</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Your profile has been saved. You can now proceed to scenarios and planning tools.
          </p>
        </div>
      ) : null}

      {!completed && step === 1 ? (
        <Step1AccountForm
          data={draft.step1}
          error={error}
          isSubmitting={autoLoginLoading}
          onFieldChange={updateStep1Field}
          onNext={handleStep1Next}
        />
      ) : null}
      {!completed && step === 2 ? (
        <Step2PersonalForm
          data={draft.step2}
          error={error}
          onBack={() => setStep(1)}
          onNext={handleStep2Next}
          onChange={(next) => setDraft((prev) => ({ ...prev, step2: next }))}
        />
      ) : null}
      {!completed && step === 3 ? (
        <Step3StagesCards
          stages={draft.stages}
          error={error}
          onBack={() => setStep(2)}
          onNext={handleStep3Next}
          onChange={(stages) => setDraft((prev) => ({ ...prev, stages }))}
        />
      ) : null}
      {!completed && step === 4 ? (
        <Step4AssetsCards
          assets={draft.assets}
          error={error}
          isSubmitting={saving}
          onBack={() => setStep(3)}
          onSubmit={handleStep4Submit}
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
