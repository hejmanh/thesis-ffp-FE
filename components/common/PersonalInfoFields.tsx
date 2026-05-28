"use client";

import type { ReactNode } from "react";
import FormField from "@/components/common/FormField";
import type { SelectOption } from "@/utils/referenceOptions";

type PersonalInfoVariant = "register" | "account";

type PersonalInfoFieldData = {
  email: string;
  birthYear: string;
  country: string;
  sex: string;
};

type PasswordFieldKey = "password" | "confirmPassword" | "currentPassword";

interface SharedPasswordFields {
  mode: "register" | "account";
  data: {
    password: string;
    confirmPassword: string;
    currentPassword?: string;
  };
  onFieldChange: (key: PasswordFieldKey, value: string) => void;
}

interface PersonalInfoFieldsProps {
  data?: PersonalInfoFieldData;
  variant: PersonalInfoVariant;
  countryOptions?: SelectOption[];
  sexOptions?: SelectOption[];
  onFieldChange: <K extends keyof PersonalInfoFieldData>(
    key: K,
    value: PersonalInfoFieldData[K],
  ) => void;
  leadingField?: ReactNode;
  showPersonalFields?: boolean;
  passwordFields?: SharedPasswordFields;
}

export default function PersonalInfoFields({
  data,
  variant,
  countryOptions = [],
  sexOptions = [],
  onFieldChange,
  leadingField,
  showPersonalFields = true,
  passwordFields,
}: PersonalInfoFieldsProps) {
  const currentYear = new Date().getFullYear();
  const birthYearOptions = Array.from(
    { length: currentYear - 1940 + 1 },
    (_, index) => {
      const year = String(currentYear - index);
      return { label: year, value: year };
    },
  );

  const isRegister = variant === "register";
  const inputClassName = isRegister ? "h-10 border-primary/60" : "h-10";
  const selectClassName = isRegister ? "h-10 border-primary/60" : "h-11";
  const accountFieldWidthClassName = isRegister ? undefined : "max-w-sm";
  const gridClassName = isRegister
    ? "grid grid-cols-1 gap-5 sm:grid-cols-2"
    : "grid grid-cols-1 gap-4 sm:grid-cols-2";

  const resolvedData: PersonalInfoFieldData = {
    email: data?.email ?? "",
    birthYear: data?.birthYear ?? "",
    country: data?.country ?? "",
    sex: data?.sex ?? "",
  };

  const passwordContent = passwordFields ? (
    <div className="space-y-4">
      {passwordFields.mode === "account" ? (
        <FormField
          id="account_current_password"
          name="account_current_password"
          label="Current password"
          className={
            passwordFields.mode === "account"
              ? accountFieldWidthClassName
              : undefined
          }
          variant="password"
          inputClassName={inputClassName}
          placeholder="Enter current password"
          inputProps={{
            value: passwordFields.data.currentPassword ?? "",
            onChange: (event) =>
              passwordFields.onFieldChange(
                "currentPassword",
                event.target.value,
              ),
            autoComplete: "current-password",
          }}
        />
      ) : null}

      <FormField
        id={
          passwordFields.mode === "register"
            ? "password"
            : "account_new_password"
        }
        name={
          passwordFields.mode === "register"
            ? "password"
            : "account_new_password"
        }
        label={passwordFields.mode === "register" ? "Password" : "New password"}
        isRequired={passwordFields.mode === "register"}
        className={
          passwordFields.mode === "account"
            ? accountFieldWidthClassName
            : undefined
        }
        variant="password"
        inputClassName={inputClassName}
        placeholder={
          passwordFields.mode === "register"
            ? "Enter your password"
            : "Enter new password"
        }
        inputProps={{
          value: passwordFields.data.password,
          onChange: (event) =>
            passwordFields.onFieldChange("password", event.target.value),
          autoComplete: "new-password",
        }}
      />

      <FormField
        id={
          passwordFields.mode === "register"
            ? "confirmPassword"
            : "account_confirm_password"
        }
        name={
          passwordFields.mode === "register"
            ? "confirmPassword"
            : "account_confirm_password"
        }
        label="Confirm password"
        isRequired={passwordFields.mode === "register"}
        className={
          passwordFields.mode === "account"
            ? accountFieldWidthClassName
            : undefined
        }
        variant="password"
        inputClassName={inputClassName}
        placeholder={
          passwordFields.mode === "register"
            ? "Confirm your password"
            : "Confirm new password"
        }
        inputProps={{
          value: passwordFields.data.confirmPassword,
          onChange: (event) =>
            passwordFields.onFieldChange("confirmPassword", event.target.value),
          autoComplete: "new-password",
        }}
      />
    </div>
  ) : null;

  if (!showPersonalFields) {
    return passwordContent;
  }

  return (
    <>
      {isRegister ? (
        <>
          <FormField
            id="email"
            name="email"
            label="Email"
            isRequired={true}
            className={accountFieldWidthClassName}
            inputClassName={inputClassName}
            placeholder="Enter your email"
            inputProps={{
              value: resolvedData.email,
              type: "email",
              onChange: (event) => onFieldChange("email", event.target.value),
              autoComplete: "email",
            }}
          />

          {passwordContent}

          <div className={gridClassName}>
            {leadingField}

            <FormField
              id="sex"
              name="sex"
              label="Gender"
              isRequired={true}
              variant="select"
              selectClassName={selectClassName}
              placeholder="Select gender"
              value={resolvedData.sex}
              onChange={(value) => onFieldChange("sex", value)}
              options={sexOptions}
            />

            <FormField
              id="birthYear"
              name="birthYear"
              label="Birth Year"
              isRequired={true}
              variant="select"
              selectClassName={selectClassName}
              placeholder="Select year"
              value={resolvedData.birthYear}
              onChange={(value) => onFieldChange("birthYear", value)}
              options={birthYearOptions}
            />

            <FormField
              id="country"
              name="country"
              label="Country"
              isRequired={true}
              variant="select"
              selectClassName={selectClassName}
              placeholder="Select country"
              value={resolvedData.country}
              onChange={(value) => onFieldChange("country", value)}
              options={countryOptions}
              searchable={true}
            />
          </div>
        </>
      ) : (
        <>
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              id="account_email"
              name="account_email"
              label="Email"
              inputClassName={inputClassName}
              placeholder="Enter your email"
              inputProps={{
                value: resolvedData.email,
                type: "email",
                onChange: (event) => onFieldChange("email", event.target.value),
                autoComplete: "email",
              }}
            />

            <FormField
              id="account_country"
              name="account_country"
              label="Country"
              variant="select"
              selectClassName={selectClassName}
              placeholder="Select country"
              value={resolvedData.country}
              onChange={(value) => onFieldChange("country", value)}
              options={countryOptions}
              searchable={true}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              id="account_gender"
              name="account_gender"
              label="Gender"
              variant="select"
              selectClassName={selectClassName}
              placeholder="Select gender"
              value={resolvedData.sex}
              onChange={(value) => onFieldChange("sex", value)}
              options={sexOptions}
            />

            <FormField
              id="account_birth_year"
              name="account_birth_year"
              label="Birth Year"
              variant="select"
              selectClassName={selectClassName}
              placeholder="Select year"
              value={resolvedData.birthYear}
              onChange={(value) => onFieldChange("birthYear", value)}
              options={birthYearOptions}
            />
          </div>

          {passwordContent}
        </>
      )}
    </>
  );
}
