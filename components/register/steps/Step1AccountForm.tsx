"use client";

import { Icon } from "@iconify/react";
import Button from "@/components/common/Button";
import FormField from "@/components/common/FormField";
import PersonalInfoFields from "@/components/common/PersonalInfoFields";
import { useEnterToFocusNextField } from "@/components/common/useEnterToFocusNextField";
import type { Step1AccountData } from "@/types/onboarding";
import type { SelectOption } from "@/utils/referenceOptions";
import { useLocaleRouter, useTranslations } from "@/i18n/client";

interface Step1AccountFormProps {
  data: Step1AccountData;
  error: string;
  successMessage?: string;
  submissionStage: "registering" | "resending" | null;
  countryOptions: SelectOption[];
  sexOptions: SelectOption[];
  onFieldChange: <K extends keyof Step1AccountData>(
    key: K,
    value: Step1AccountData[K],
  ) => void;
  onNext: () => void;
  onResendVerification: () => void;
}

export default function Step1AccountForm({
  data,
  error,
  successMessage,
  submissionStage,
  countryOptions,
  sexOptions,
  onFieldChange,
  onNext,
  onResendVerification,
}: Step1AccountFormProps) {
  const t = useTranslations("Register.account");
  const fields = useTranslations("Fields");
  const { containerRef, handleEnterKeyDown } = useEnterToFocusNextField();
  const isReferenceReady = countryOptions.length > 0 && sexOptions.length > 0;
  const router = useLocaleRouter();
  const isSubmitting = submissionStage !== null;
  const submitLabel =
    submissionStage === "registering"
      ? t("submitting")
      : t("submit");

  return (
    <div
      ref={containerRef}
      className="mt-3"
      onKeyDown={handleEnterKeyDown}
    >
      <h2 className="text-center text-3xl font-bold text-primary">
        {t("title")}
      </h2>
      <div className="mx-auto mt-8 max-w-md space-y-6">
        <PersonalInfoFields
          variant="register"
          data={{
            email: data.email,
            birthYear: data.birthYear,
            country: data.country,
            sex: data.sex,
          }}
          countryOptions={countryOptions}
          sexOptions={sexOptions}
          onFieldChange={(key, value) => onFieldChange(key, value)}
          passwordFields={{
            mode: "register",
            data: {
              password: data.password,
              confirmPassword: data.confirmPassword,
            },
            onFieldChange: (key, value) => {
              if (key === "password" || key === "confirmPassword") {
                onFieldChange(key, value);
              }
            },
          }}
          leadingField={
            <FormField
              id="name"
              name="name"
              label={fields("name")}
              isRequired
              inputClassName="h-10 border-primary/60"
              placeholder={fields("enterName")}
              inputProps={{
                value: data.name,
                onChange: (event) => onFieldChange("name", event.target.value),
                autoComplete: "name",
              }}
            />
          }
        />
      </div>
      {error ? (
        <p className="mt-4 text-center text-sm font-semibold text-red-600">
          {error}
        </p>
      ) : null}
      {!error && successMessage ? (
        <div className="mt-4 text-center">
          <p className="text-sm font-semibold text-emerald-600">
            {successMessage}
          </p>
          <button
            type="button"
            onClick={onResendVerification}
            disabled={submissionStage === "resending"}
            className="mt-2 text-sm font-semibold text-primary underline disabled:cursor-not-allowed disabled:text-muted-foreground"
          >
            {submissionStage === "resending"
              ? t("resendingVerification")
              : t("resendVerification")}
          </button>
        </div>
      ) : null}
      {!isReferenceReady ? (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t("loadingOptions")}
        </p>
      ) : null}
      <div className="mx-auto mt-8 max-w-md">
        <Button
          className="h-11 w-full rounded-full text-base"
          onClick={onNext}
          disabled={isSubmitting || !isReferenceReady}
        >
          <span className="inline-flex items-center gap-2 transition-opacity duration-200">
            {isSubmitting ? (
              <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" />
            ) : null}
            <span>{submitLabel}</span>
          </span>
        </Button>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("alreadyHaveAccount")}{" "}
        <button
          type="button"
          onClick={() => router.push("/?login=1")}
          className="font-semibold text-primary underline hover:text-primary-600 transition"
        >
          {t("signIn")}
        </button>
      </p>
    </div>
  );
}
