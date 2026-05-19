"use client";

import PersonalInfoFields from "@/components/common/PersonalInfoFields";
import type { PersonalInfoData } from "@/utils/types";
import type { SelectOption } from "@/utils/referenceOptions";

interface PersonalInfoFormProps {
  data: PersonalInfoData;
  onChange: (next: PersonalInfoData) => void;
  countryOptions?: SelectOption[];
  sexOptions?: SelectOption[];
}

export default function PersonalInfoForm({
  data,
  onChange,
  countryOptions = [],
  sexOptions = [],
}: PersonalInfoFormProps) {
  function updateField(
    key: "email" | "birthYear" | "country" | "sex",
    value: string,
  ) {
    if (key === "sex") {
      onChange({ ...data, gender: value });
      return;
    }

    onChange({ ...data, [key]: value });
  }

  return (
    <PersonalInfoFields
      variant="account"
      data={{
        email: data.email,
        birthYear: data.birthYear,
        country: data.country,
        sex: data.gender,
      }}
      countryOptions={countryOptions}
      sexOptions={sexOptions}
      onFieldChange={updateField}
    />
  );
}
