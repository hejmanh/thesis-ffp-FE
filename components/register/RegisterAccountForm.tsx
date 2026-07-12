"use client";

import { useEffect, useMemo, useState } from "react";
import AnimatedPanel from "@/components/common/AnimatedPanel";
import Step1AccountForm from "@/components/register/steps/Step1AccountForm";
import type { Step1AccountData } from "@/types/onboarding";
import { validateStep1 } from "@/utils/onboardingValidators";
import { createEmptyOnboardingState } from "@/store/onboardingStorage";
import { useAuth, usePersonalInfoReferences } from "@/hooks";
import { useAuthStore } from "@/store/auth.store";
import {
  mapCountriesToOptions,
  mapSexTypesToOptions,
} from "@/utils/referenceOptions";
import { useLocaleRouter, useTranslations } from "@/i18n/client";
import { useApiErrorMessage } from "@/hooks/useApiErrorMessage";

type SubmissionStage = "registering" | "resending" | null;

export default function RegisterAccountForm() {
  const router = useLocaleRouter();
  const t = useTranslations("Register.account");
  const validationT = useTranslations("Validation");
  const getApiErrorMessage = useApiErrorMessage();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [data, setData] = useState<Step1AccountData>(
    () => createEmptyOnboardingState().step1,
  );
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [successDescription, setSuccessDescription] = useState(t("successDescription"));
  const [submissionStage, setSubmissionStage] = useState<SubmissionStage>(null);
  const { register, resendVerificationEmail } = useAuth();
  const {
    countries,
    sexTypes,
    error: referenceError,
  } = usePersonalInfoReferences();

  const countryOptions = useMemo(
    () => mapCountriesToOptions(countries),
    [countries],
  );

  const sexOptions = useMemo(() => mapSexTypesToOptions(sexTypes), [sexTypes]);

  const displayError = error || referenceError || "";

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  function updateField<K extends keyof Step1AccountData>(
    key: K,
    value: Step1AccountData[K],
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCreateAccount() {
    setError("");
    setSuccessMessage("");
    const validation = validateStep1(data);
    if (validation) {
      setError(
        validation === "passwordMinLength"
          ? validationT("passwordMinLength", { min: 8 })
          : validationT(validation),
      );
      return;
    }

    const countryId = Number(data.country);
    const sexTypeId = Number(data.sex);
    if (!Number.isInteger(countryId) || !Number.isInteger(sexTypeId)) {
      setError(t("invalidOptions"));
      return;
    }

    setSubmissionStage("registering");
    try {
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
        birthYear: Number(data.birthYear),
        countryId,
        sexTypeId,
      });

      setSuccessMessage(t("success"));
      setSuccessDescription(t("successDescription"));
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, t("fallbackError")));
    } finally {
      setSubmissionStage(null);
    }
  }

  async function handleResendVerification() {
    const email = data.email.trim();
    if (!email) {
      setError(validationT("requiredFields"));
      return;
    }

    setError("");
    setSubmissionStage("resending");
    try {
      await resendVerificationEmail(email);
      setSuccessMessage(t("resendSuccess"));
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, t("resendFallbackError")));
    } finally {
      setSubmissionStage(null);
    }
  }

  return (
    <div className="relative mx-auto max-w-xl rounded-3xl bg-slate-50 p-6 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.4)] sm:p-8">
      <AnimatedPanel>
        <Step1AccountForm
          data={data}
          error={displayError}
          successMessage={successMessage}
          successDescription={successDescription}
          submissionStage={submissionStage}
          countryOptions={countryOptions}
          sexOptions={sexOptions}
          onFieldChange={updateField}
          onNext={handleCreateAccount}
          onResendVerification={handleResendVerification}
        />
      </AnimatedPanel>
    </div>
  );
}
