"use client";

import Button from "@/components/common/Button";
import PersonalInfoFields from "@/components/common/PersonalInfoFields";
import type { SecurityData } from "@/utils/types";

interface AccountPasswordCardProps {
  data: SecurityData;
  onChange: <K extends keyof SecurityData>(
    key: K,
    value: SecurityData[K],
  ) => void;
}

export default function AccountPasswordCard({
  data,
  onChange,
}: AccountPasswordCardProps) {
  return (
    <div className="mt-8 rounded-xl border border-border bg-slate-50 p-4">
      <h3 className="mb-2 text-lg font-semibold text-slate-900">Password</h3>
      <PersonalInfoFields
        variant="account"
        showPersonalFields={false}
        onFieldChange={() => {}}
        passwordFields={{
          mode: "account",
          data: {
            currentPassword: data.currentPassword,
            password: data.newPassword,
            confirmPassword: data.confirmPassword,
          },
          onFieldChange: (key, value) => {
            if (key === "password") {
              onChange("newPassword", value);
              return;
            }

            if (key === "confirmPassword" || key === "currentPassword") {
              onChange(key, value);
            }
          },
        }}
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Button className="h-11 rounded-full px-5">Change Password</Button>
      </div>
    </div>
  );
}
