"use client";

import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const birthYearOptions = Array.from({ length: currentYear - 1940 + 1 }, (_, index) => {
    const year = String(currentYear - index);
    return { label: year, value: year };
  });

  return (
    <div className="mt-8">
      <h2 className="text-center text-3xl font-bold text-primary">Registration</h2>
      <div className="mx-auto mt-8 max-w-5xl space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            id="email"
            name="email"
            label="Email"
            inputClassName="h-10 border-primary/60"
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
            inputClassName="h-10 border-primary/60"
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
            inputClassName="h-10 border-primary/60"
            placeholder="Confirm your password"
            inputProps={{
              value: data.confirmPassword,
              type: "password",
              onChange: (event) => onFieldChange("confirmPassword", event.target.value),
              autoComplete: "new-password",
            }}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <FormField
            id="name"
            name="name"
            label="Name"
            inputClassName="h-10 border-primary/60"
            placeholder="Enter your name"
            inputProps={{
              value: data.name,
              onChange: (event) => onFieldChange("name", event.target.value),
              autoComplete: "name",
            }}
          />
          <FormField
            id="sex"
            name="sex"
            label="Gender"
            variant="select"
            selectClassName="h-10 border-primary/60"
            placeholder="Select gender"
            value={data.sex}
            onChange={(value) => onFieldChange("sex", value)}
            options={SEX_OPTIONS.map((item) => ({ label: item, value: item }))}
          />
          <FormField
            id="birthYear"
            name="birthYear"
            label="Birth Year"
            variant="select"
            selectClassName="h-10 border-primary/60"
            placeholder="Select year"
            value={data.birthYear}
            onChange={(value) => onFieldChange("birthYear", value)}
            options={birthYearOptions}
          />
          <FormField
            id="country"
            name="country"
            label="Country"
            variant="select"
            selectClassName="h-10 border-primary/60"
            placeholder="Select country"
            value={data.country}
            onChange={(value) => onFieldChange("country", value)}
            options={COUNTRY_OPTIONS.map((country) => ({ label: country, value: country }))}
            searchable={true}
          />
        </div>
      </div>
      {error ? <p className="mt-4 text-center text-sm font-semibold text-red-600">{error}</p> : null}
      <div className="mx-auto mt-8 max-w-5xl">
        <Button className="h-11 w-full rounded-full text-base" onClick={onNext} disabled={isSubmitting}>
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
