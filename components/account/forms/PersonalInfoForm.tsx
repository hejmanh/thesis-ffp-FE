"use client";

import FormField from "@/components/common/FormField";
import type { PersonalInfoData } from "@/utils/types";
import { COUNTRY_OPTIONS, SEX_OPTIONS } from "@/utils/onboardingConstants";

interface PersonalInfoFormProps {
  data: PersonalInfoData;
  onChange: (next: PersonalInfoData) => void;
}

export default function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const currentYear = new Date().getFullYear();
  const birthYearOptions = Array.from({ length: currentYear - 1940 + 1 }, (_, index) => {
    const year = String(currentYear - index);
    return { label: year, value: year };
  });

  function updateField<K extends keyof PersonalInfoData>(key: K, value: PersonalInfoData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField
        label="Email"
        id="account_email"
        name="account_email"
        className="sm:col-span-2"
        inputClassName="h-11"
        placeholder="you@example.com"
        inputProps={{
          type: "email",
          value: data.email,
          onChange: (event) => updateField("email", event.target.value),
          autoComplete: "email",
        }}
      />
      <FormField
        label="Birth Year"
        id="account_birth_year"
        name="account_birth_year"
        variant="select"
        selectClassName="h-11"
        placeholder="Select year"
        value={data.birthYear}
        onChange={(value) => updateField("birthYear", value)}
        options={birthYearOptions}
      />
      <FormField
        label="Country"
        variant="select"
        id="account_country"
        name="account_country"
        selectClassName="h-11"
        placeholder="Select country"
        value={data.country}
        onChange={(value) => updateField("country", value)}
        options={COUNTRY_OPTIONS.map((country) => ({ label: country, value: country }))}
        searchable={true}
      />
      <FormField
        label="Gender"
        variant="select"
        id="account_gender"
        name="account_gender"
        selectClassName="h-11"
        placeholder="Select gender"
        value={data.gender}
        onChange={(value) => updateField("gender", value)}
        options={SEX_OPTIONS.map((option) => ({ label: option, value: option }))}
      />
    </div>
  );
}
