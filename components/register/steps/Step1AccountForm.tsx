"use client";

import Button from "@/components/common/Button";
import Link from "next/link";
import FormField from "@/components/common/FormField";
import type { Step1AccountData } from "@/types/onboarding";
import { SEX_OPTIONS, COUNTRY_OPTIONS } from "@/utils/onboardingConstants";

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
      <h2 className="text-center text-3xl font-bold text-primary">Registration</h2>
      <div className="mx-auto mt-8 max-w-3xl space-y-5">
        <FormField
          id="email"
          name="email"
          label="Email"
          labelClassName="text-3xl"
          inputClassName="h-11 border-primary/60 text-lg"
          placeholder="Enter your email"
          inputProps={{
            value: data.email,
            type: "email",
            onChange: (event) => onFieldChange("email", event.target.value),
            autoComplete: "email",
          }}
        />
        <FormField
          id="password"
          name="password"
          label="Password"
          labelClassName="text-3xl"
          inputClassName="h-11 border-primary/60 text-lg"
          placeholder="Enter your password"
          inputProps={{
            value: data.password,
            type: "password",
            onChange: (event) => onFieldChange("password", event.target.value),
            autoComplete: "new-password",
          }}
        />
        <FormField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          labelClassName="text-3xl"
          inputClassName="h-11 border-primary/60 text-lg"
          placeholder="Confirm your password"
          inputProps={{
            value: data.confirmPassword,
            type: "password",
            onChange: (event) => onFieldChange("confirmPassword", event.target.value),
            autoComplete: "new-password",
          }}
        />
        <FormField
          id="birthYear"
          name="birthYear"
          label="Birth Year"
          labelClassName="text-3xl"
          inputClassName="h-11 border-primary/60 text-lg"
          placeholder="Enter your birth year"
          inputProps={{
            value: data.birthYear,
            onChange: (event) => onFieldChange("birthYear", event.target.value),
            autoComplete: "bday-year",
          }}
        />
        <FormField
          id="country"
          name="country"
          label="Country"
          variant="select"
          labelClassName="text-3xl"
          selectClassName="h-11 border-primary/60 text-lg"
          placeholder="Select your country"
          value={data.country}
          onChange={(value) => onFieldChange("country", value)}
          options={COUNTRY_OPTIONS.map((country) => ({ label: country, value: country }))}
          searchable={true}
        />
        <FormField
          id="sex"
          name="sex"
          label="Gender"
          variant="select"
          labelClassName="text-3xl"
          selectClassName="h-11 border-primary/60 text-lg"
          placeholder="Select your gender"
          value={data.sex}
          onChange={(value) => onFieldChange("sex", value)}
          options={SEX_OPTIONS.map((item) => ({ label: item, value: item }))}
        />
      </div>
      {error ? <p className="mt-4 text-center text-sm font-semibold text-red-600">{error}</p> : null}
      <div className="mx-auto mt-8 max-w-3xl">
        <Button className="h-11 w-full rounded-full text-lg" onClick={onNext} disabled={isSubmitting}>
          {isSubmitting ? "Auto logging in..." : "Next"}
        </Button>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/?login=1" className="font-semibold text-primary underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
