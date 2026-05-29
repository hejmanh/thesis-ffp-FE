"use client";

import { useState } from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import FormField from "@/components/common/FormField";
import PersonalInfoFields from "@/components/common/PersonalInfoFields";
import { useUserContext } from "@/providers/UserContextProvider";
import type { SecurityData } from "@/utils/types";

const ACCOUNT_FIELD_WIDTH_CLASS = "max-w-sm";

const INITIAL_SECURITY_DATA: SecurityData = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function PersonalInfoSection() {
  const { data: userContext } = useUserContext();
  const [securityData, setSecurityData] = useState<SecurityData>(
    INITIAL_SECURITY_DATA,
  );
  const email = userContext?.email ?? "";

  function updateSecurityField<K extends keyof SecurityData>(
    key: K,
    value: SecurityData[K],
  ) {
    setSecurityData((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Card
      hoverable={false}
      className="w-full rounded-xl bg-white p-6 shadow-md"
    >
      <h2 className="text-2xl font-bold text-primary">
        Account
      </h2>
      {/* <p className="mt-1 text-sm text-muted-foreground">
        Review your account email and update your password credentials.
      </p> */}
      <div className="mt-6 rounded-xl border border-border bg-slate-50 p-4">
        {/* <h3 className="mb-2 text-base font-semibold text-slate-900">
          Email and Password
        </h3> */}
        <FormField
          id="account_email"
          name="account_email"
          label="Email"
          className={ACCOUNT_FIELD_WIDTH_CLASS}
          inputClassName="h-10"
          inputProps={{
            value: email,
            type: "email",
            autoComplete: "email",
            disabled: true,
          }}
        />
        <div className="mt-4">
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
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="h-11 rounded-full px-5">Change Password</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
