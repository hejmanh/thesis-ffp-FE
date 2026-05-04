"use client";

import Button from "@/components/common/Button";
import Link from "next/link";
import FormField from "@/components/common/FormField";
import type { Step1AccountData } from "@/types/onboarding";
import { SEX_OPTIONS } from "@/utils/onboardingConstants";

interface Step1AccountFormProps {
  data: Step1AccountData;
  error: string;
  isSubmitting: boolean;
  onFieldChange: <K extends keyof Step1AccountData>(key: K, value: Step1AccountData[K]) => void;
  onNext: () => void;
}

export default function Step1AccountForm({
  data,
  error,
  isSubmitting,
  onFieldChange,
  onNext,
}: Step1AccountFormProps) {
  return (
    <div className="mt-8">
      <h2 className="text-center text-5xl font-bold text-primary">Registration</h2>
      <div className="mx-auto mt-8 max-w-3xl space-y-5">
        <FormField
          label="Email"
          labelClassName="text-3xl"
          inputClassName="h-11 border-primary/60 text-lg"
          placeholder="Enter your email"
          inputProps={{
            value: data.email,
            type: "email",
            onChange: (event) => onFieldChange("email", event.target.value),
          }}
        />
        <FormField
          label="Password"
          labelClassName="text-3xl"
          inputClassName="h-11 border-primary/60 text-lg"
          placeholder="Enter your password"
          inputProps={{
            value: data.password,
            type: "password",
            onChange: (event) => onFieldChange("password", event.target.value),
          }}
        />
        <FormField
          label="Confirm Password"
          labelClassName="text-3xl"
          inputClassName="h-11 border-primary/60 text-lg"
          placeholder="Confirm your password"
          inputProps={{
            value: data.confirmPassword,
            type: "password",
            onChange: (event) => onFieldChange("confirmPassword", event.target.value),
          }}
        />
        <FormField
          label="Birth Year"
          labelClassName="text-3xl"
          inputClassName="h-11 border-primary/60 text-lg"
          placeholder="Enter your birth year"
          inputProps={{
            value: data.birthYear,
            onChange: (event) => onFieldChange("birthYear", event.target.value),
          }}
        />
        <FormField
          label="Country"
          labelClassName="text-3xl"
          inputClassName="h-11 border-primary/60 text-lg"
          placeholder="Enter your country"
          inputProps={{
            value: data.country,
            onChange: (event) => onFieldChange("country", event.target.value),
          }}
        />
        <FormField
          label="Gender"
          variant="select"
          labelClassName="text-3xl"
          selectClassName="h-11 border-primary/60 px-5 text-lg"
          placeholder="Select your gender"
          selectProps={{
            value: data.sex,
            onChange: (event) => onFieldChange("sex", event.target.value),
          }}
          options={SEX_OPTIONS.map((item) => ({ label: item, value: item }))}
        />
      </div>
      {error ? <p className="mt-4 text-center text-sm font-semibold text-red-600">{error}</p> : null}
      <div className="mx-auto mt-8 max-w-3xl">
        <Button className="h-11 w-full rounded-full text-lg" onClick={onNext} disabled={isSubmitting}>
          {isSubmitting ? "Auto logging in..." : "Next"}
        </Button>
      </div>
      <p className="mt-6 text-center text-lg text-muted-foreground">
        Already have an account?{" "}
        <Link href="/?login=1" className="font-semibold text-primary underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
