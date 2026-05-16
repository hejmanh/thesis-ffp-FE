"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AnimatedPanel from "@/components/common/AnimatedPanel";
import Step1AccountForm from "@/components/register/steps/Step1AccountForm";
import type { Step1AccountData } from "@/types/onboarding";
import { INITIAL_ONBOARDING_DRAFT } from "@/utils/onboardingConstants";
import { validateStep1 } from "@/utils/onboardingValidators";
import { useAuth } from "@/hooks";
import {
  listCountries,
  listSexTypes,
} from "@/services/reference/referenceService";
import type { Country, SexType } from "@/types/reference";

export default function RegisterAccountForm() {
  const router = useRouter();
  const [data, setData] = useState<Step1AccountData>(
    INITIAL_ONBOARDING_DRAFT.step1,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [referenceError, setReferenceError] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [sexTypes, setSexTypes] = useState<SexType[]>([]);
  const { register } = useAuth();

  useEffect(() => {
    let active = true;

    const loadReferences = async () => {
      try {
        const [countriesResult, sexTypesResult] = await Promise.all([
          listCountries(),
          listSexTypes(),
        ]);
        if (!active) return;
        setCountries(countriesResult);
        setSexTypes(sexTypesResult);
        setReferenceError("");
      } catch {
        if (!active) return;
        setReferenceError(
          "Unable to load registration options. Please refresh and try again.",
        );
      }
    };

    loadReferences();

    return () => {
      active = false;
    };
  }, []);

  const countryOptions = useMemo(() => {
    if (!countries.length) return [];
    return countries.map((country) => ({
      label: country.name ?? country.code ?? `Country ${country.id}`,
      value: String(country.id),
    }));
  }, [countries]);

  const sexOptions = useMemo(() => {
    if (!sexTypes.length) return [];
    return sexTypes.map((sex) => ({
      label: sex.title ?? sex.code ?? `Type ${sex.id}`,
      value: String(sex.id),
    }));
  }, [sexTypes]);

  const displayError = error || referenceError;

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

    if (referenceError) {
      setError(referenceError);
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
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
        birthYear: Number(data.birthYear),
        countryId,
        sexTypeId,
      });
      setToastMessage(
        "Account created. Check your email to verify your account.",
      );
      // router.push("/?login=1");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to register.",
      );
    } finally {
      setToastMessage("");
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
