"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AnimatedPanel from "@/components/common/AnimatedPanel";
import Step1AccountForm from "@/components/register/steps/Step1AccountForm";
import type { Step1AccountData } from "@/types/onboarding";
import {
  INITIAL_ONBOARDING_DRAFT,
  ONBOARDING_REGISTRATION_GATE_KEY,
  ONBOARDING_STORAGE_KEY,
} from "@/utils/onboardingConstants";
import { validateStep1 } from "@/utils/onboardingValidators";
import { useAuth, usePersonalInfoReferences } from "@/hooks";
import {
  mapCountriesToOptions,
  mapSexTypesToOptions,
} from "@/utils/referenceOptions";

export default function RegisterAccountForm() {
  const router = useRouter();
  const [data, setData] = useState<Step1AccountData>(
    INITIAL_ONBOARDING_DRAFT.step1,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { register } = useAuth();
  const { countries, sexTypes } = usePersonalInfoReferences();

  const countryOptions = useMemo(
    () => mapCountriesToOptions(countries),
    [countries],
  );

  const sexOptions = useMemo(() => mapSexTypesToOptions(sexTypes), [sexTypes]);

  const displayError = error;

  function updateField<K extends keyof Step1AccountData>(
    key: K,
    value: Step1AccountData[K],
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCreateAccount() {
    setError("");
    const validation = validateStep1(data);
    if (validation) {
      setError(validation);
      return;
    }

    const countryId = Number(data.country);
    const sexTypeId = Number(data.sex);
    if (!Number.isInteger(countryId) || !Number.isInteger(sexTypeId)) {
      setError("Please select valid registration options.");
      return;
    }

    setLoading(true);
    try {
      const message = await register({
        name: data.name,
        email: data.email,
        password: data.password,
        birthYear: Number(data.birthYear),
        countryId,
        sexTypeId,
      });

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          ONBOARDING_STORAGE_KEY,
          JSON.stringify({
            ...INITIAL_ONBOARDING_DRAFT,
            step1: data,
          }),
        );
        window.sessionStorage.setItem(ONBOARDING_REGISTRATION_GATE_KEY, "true");
      }

      setToastMessage(message ?? "Successfully created account");
      router.push("/onboarding");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to register.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative mx-auto max-w-xl rounded-3xl bg-slate-50 p-6 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.4)] sm:p-8">
      <AnimatedPanel>
        <Step1AccountForm
          data={data}
          error={displayError}
          isSubmitting={loading}
          countryOptions={countryOptions}
          sexOptions={sexOptions}
          onFieldChange={updateField}
          onNext={handleCreateAccount}
        />
      </AnimatedPanel>
      {toastMessage ? (
        <div className="fixed right-6 top-6 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}
