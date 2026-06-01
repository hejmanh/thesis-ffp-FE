"use client";

import PersonalInfoForm from "@/components/account/forms/PersonalInfoForm";
import type { PersonalInfoData } from "@/utils/types";
import type { SelectOption } from "@/utils/referenceOptions";

interface AccountBasicInfoCardProps {
  data: PersonalInfoData;
  countryOptions: SelectOption[];
  sexOptions: SelectOption[];
  onChange: (next: PersonalInfoData) => void;
}

export default function AccountBasicInfoCard({
  data,
  countryOptions,
  sexOptions,
  onChange,
}: AccountBasicInfoCardProps) {
  return (
    <div className="rounded-xl border border-border bg-slate-50 p-4">
      <h3 className="text-lg font-semibold text-slate-900">
        Email and Basic information
      </h3>
      <PersonalInfoForm
        data={data}
        onChange={onChange}
        countryOptions={countryOptions}
        sexOptions={sexOptions}
      />
    </div>
  );
}
