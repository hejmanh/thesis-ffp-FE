"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import FormField from "@/components/common/FormField";
import PersonalInfoFields from "@/components/common/PersonalInfoFields";
import type { Step1AccountData } from "@/types/onboarding";
import type { SelectOption } from "@/utils/referenceOptions";

interface Step1AccountFormProps {
  data: Step1AccountData;
  error: string;
  isSubmitting: boolean;
  countryOptions: SelectOption[];
  sexOptions: SelectOption[];
  onFieldChange: <K extends keyof Step1AccountData>(
    key: K,
    value: Step1AccountData[K],
  ) => void;
  onNext: () => void;
}

export default function Step1AccountForm({
  data,
  error,
  isSubmitting,
  countryOptions,
  sexOptions,
  onFieldChange,
  onNext,
}: Step1AccountFormProps) {
  const isReferenceReady = countryOptions.length > 0 && sexOptions.length > 0;
  const router = useRouter();

  return (
    <div className="mt-3">
      <h2 className="text-center text-3xl font-bold text-primary">
        Registration
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
              label="Name"
              isRequired
              inputClassName="h-10 border-primary/60"
              placeholder="Enter your name"
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
      {!isReferenceReady ? (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Loading registration options...
        </p>
      ) : null}
      <div className="mx-auto mt-8 max-w-md">
        <Button
          className="h-11 w-full rounded-full text-base"
          onClick={onNext}
          disabled={isSubmitting || !isReferenceReady}
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => router.push("/?login=1")}
          className="font-semibold text-primary underline hover:text-primary-600 transition"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
