"use client";

import { useState } from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import FormField from "@/components/common/FormField";
import PersonalInfoFields from "@/components/common/PersonalInfoFields";
import { useUserContext } from "@/providers/UserContextProvider";
import { authService } from "@/services/auth.service";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const email = userContext?.email ?? "";

  function updateSecurityField<K extends keyof SecurityData>(
    key: K,
    value: SecurityData[K],
  ) {
    setSecurityData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleChangePassword() {
    setPasswordMessage(null);
    setPasswordError(null);

    const currentPassword = securityData.currentPassword.trim();
    const newPassword = securityData.newPassword.trim();
    const confirmPassword = securityData.confirmPassword.trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const message = await authService.updatePassword(
        currentPassword,
        newPassword,
      );
      setPasswordMessage(message);
      setSecurityData(INITIAL_SECURITY_DATA);
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : "Unable to change password.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
          {passwordError ? (
            <p className="mt-4 text-sm font-semibold text-rose-700">
              {passwordError}
            </p>
          ) : null}
          {passwordMessage ? (
            <p className="mt-4 text-sm font-semibold text-emerald-700">
              {passwordMessage}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              className="h-11 rounded-full px-5"
              onClick={() => void handleChangePassword()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Change Password"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
