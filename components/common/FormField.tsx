"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import DropdownField from "@/components/common/DropdownField";
import Input from "@/components/common/Input";
import PasswordInput from "@/components/common/PasswordInput";
import { cn } from "@/utils/cn";

type FormFieldVariant = "input" | "select" | "password";

interface SelectOption {
  label: string;
  value: string;
}

interface FormFieldProps {
  label: ReactNode;
  variant?: FormFieldVariant;
  isRequired?: boolean;

  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  inputContainerClassName?: string;
  selectClassName?: string;

  hint?: ReactNode;
  children?: ReactNode;

  placeholder?: string;
  id?: string;
  name?: string;
  suffix?: ReactNode;

  // input
  inputProps?: InputHTMLAttributes<HTMLInputElement>;

  // select (custom dropdown)
  options?: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  searchable?: boolean;
  disabled?: boolean;
}

export default function FormField({
  label,
  variant = "input",
  isRequired = false,
  className,
  labelClassName,
  inputClassName,
  inputContainerClassName,
  selectClassName,
  hint,
  children,
  options = [],
  placeholder,
  id,
  name,
  inputProps,
  value,
  onChange,
  searchable = false,
  suffix,
  disabled = false,
}: FormFieldProps) {
  return (
    <label
      className={cn(
        "block text-sm font-medium text-slate-700",
        labelClassName,
        className,
      )}
    >
      {label ? (
        <span className="mb-1.5 inline-block">
          {label}
          {isRequired ? <span className="ml-1 text-red-600">*</span> : null}
        </span>
      ) : null}

      {variant === "select" ? (
        (children ?? (
          <DropdownField
            id={id}
            name={name}
            className={selectClassName}
            buttonClassName={selectClassName}
            options={options}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            searchable={searchable}
            disabled={disabled}
          />
        ))
      ) : variant === "password" ? (
        <PasswordInput
          id={id}
          name={name}
          className={cn(inputClassName)}
          placeholder={placeholder}
          {...inputProps}
        />
      ) : (
        <Input
          id={id}
          name={name}
          containerClassName={inputContainerClassName}
          className={cn(inputClassName)}
          placeholder={placeholder}
          suffix={suffix}
          {...inputProps}
        />
      )}
      {hint ? (
        <span className="mt-1 block text-xs text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}
