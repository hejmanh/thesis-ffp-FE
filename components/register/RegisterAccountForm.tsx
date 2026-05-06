"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Step1AccountForm from "@/components/register/steps/Step1AccountForm";
import { autoLoginByEmail, registerStep1 } from "@/services/auth/mockAuth";
import type { Step1AccountData } from "@/types/onboarding";
import { INITIAL_ONBOARDING_DRAFT } from "@/utils/onboardingConstants";
import { validateStep1 } from "@/utils/onboardingValidators";

export default function RegisterAccountForm() {
  const router = useRouter();
  const [data, setData] = useState<Step1AccountData>(INITIAL_ONBOARDING_DRAFT.step1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  function updateField<K extends keyof Step1AccountData>(key: K, value: Step1AccountData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleNext() {
    setError("");
    const validation = validateStep1(data);
    if (validation) {
      setError(validation);
      return;
    }
    setLoading(true);
    try {
      await registerStep1({
        name: data.name,
        email: data.email,
        password: data.password,
        birthYear: Number(data.birthYear),
        country: data.country,
        sex: data.sex,
      });
      setToastMessage("Account created. Signing in...");
      await autoLoginByEmail(data.email);
      router.push("/onboarding");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to register.");
    } finally {
      setToastMessage("");
      setLoading(false);
    }
  }

  return (
    <div className="relative mx-auto max-w-4xl rounded-3xl bg-slate-50 p-6 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.4)] sm:p-8">
      <Step1AccountForm
        data={data}
        error={error}
        isSubmitting={loading}
        onFieldChange={updateField}
        onNext={handleNext}
      />
      {toastMessage ? (
        <div className="fixed right-6 top-6 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}
