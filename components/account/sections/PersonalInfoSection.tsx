"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import FormField from "@/components/common/FormField";
import PersonalInfoForm from "@/components/account/forms/PersonalInfoForm";
import type { PersonalInfoData, SecurityData } from "@/utils/types";

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

  function updateSecurityField<K extends keyof SecurityData>(key: K, value: SecurityData[K]) {
    setSecurityData((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Card hoverable={false} className="w-full rounded-xl bg-white p-6 shadow-md">
      <h2 className="text-2xl font-bold text-primary">Personal Information</h2>
      <p className="mt-1 text-sm text-muted-foreground">Manage your personal profile details.</p>
      <div className="mt-8 rounded-xl border border-border bg-slate-50 p-4">
        <PersonalInfoForm data={personalData} onChange={setPersonalData} />
      </div>

      <div className="mt-8 rounded-xl border border-border bg-slate-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">Security</h3>
        <p className="mt-1 text-sm text-muted-foreground">Update your password.</p>
        <div className="mt-6 space-y-4">
           <FormField
            label="Current password"
            variant="password"
            inputClassName="h-11"
            inputProps={{
              value: securityData.currentPassword,
              placeholder: "Enter current password",
              onChange: (event) => updateSecurityField("currentPassword", event.target.value),
              autoComplete: "current-password",
            }}
          />
          <FormField
            label="New password"
            variant="password"
            inputClassName="h-11"
            inputProps={{
              value: securityData.newPassword,
              placeholder: "Enter new password",
              onChange: (event) => updateSecurityField("newPassword", event.target.value),
              autoComplete: "new-password",
            }}
          />
          <FormField
            label="Confirm password"
            variant="password"
            inputClassName="h-11"
            inputProps={{
              value: securityData.confirmPassword,
              placeholder: "Confirm new password",
              onChange: (event) => updateSecurityField("confirmPassword", event.target.value),
              autoComplete: "new-password",
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
