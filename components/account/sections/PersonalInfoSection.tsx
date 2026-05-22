"use client";

import { useMemo, useState } from "react";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import PersonalInfoFields from "@/components/common/PersonalInfoFields";
import PersonalInfoForm from "@/components/account/forms/PersonalInfoForm";
import type { PersonalInfoData, SecurityData } from "@/utils/types";
import { usePersonalInfoReferences } from "@/hooks";
import {
  mapCountriesToOptions,
  mapSexTypesToOptions,
} from "@/utils/referenceOptions";

const INITIAL_PERSONAL_INFO: PersonalInfoData = {
  email: "",
  birthYear: "",
  country: "",
  gender: "",
};

const INITIAL_SECURITY_DATA: SecurityData = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function PersonalInfoSection() {
  const [personalData, setPersonalData] = useState<PersonalInfoData>(INITIAL_PERSONAL_INFO);
  const [securityData, setSecurityData] = useState<SecurityData>(INITIAL_SECURITY_DATA);
  const { countries, sexTypes } = usePersonalInfoReferences();
  const countryOptions = useMemo(() => mapCountriesToOptions(countries), [countries]);
  const sexOptions = useMemo(() => mapSexTypesToOptions(sexTypes), [sexTypes]);

  function updateSecurityField<K extends keyof SecurityData>(key: K, value: SecurityData[K]) {
    setSecurityData((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Card hoverable={false} className="w-full rounded-xl bg-white p-6 shadow-md">
      <h2 className="text-2xl font-bold text-primary">Personal Information</h2>
      <p className="mt-1 text-sm text-muted-foreground">Manage your personal profile details.</p>
      <div className="mt-8 rounded-xl border border-border bg-slate-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">Profile</h3>
        <PersonalInfoForm
          data={personalData}
          onChange={setPersonalData}
          countryOptions={countryOptions}
          sexOptions={sexOptions}
        />
      </div>

      <div className="mt-8 rounded-xl border border-border bg-slate-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">Security</h3>
        <p className="mt-1 text-xs italic text-slate-600">Update your password.</p>
        <div className="mt-6">
          <PersonalInfoFields
            variant="account"
            showPersonalFields={false}
            onFieldChange={() => {}}
            passwordFields={{
              mode: "account",
              data: {
                currentPassword: securityData.currentPassword,
                password: securityData.newPassword,
                confirmPassword: securityData.confirmPassword,
              },
              onFieldChange: (key, value) => {
                if (key === "password") {
                  updateSecurityField("newPassword", value);
                  return;
                }

                if (key === "confirmPassword" || key === "currentPassword") {
                  updateSecurityField(key, value);
                }
              },
            }}
          />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button className="h-11 rounded-full px-5">Change Password</Button>
        </div>
      </div>

    </Card>
  );
}
