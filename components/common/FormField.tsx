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
  label: string;
  variant?: FormFieldVariant;

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
}

export default function FormField({
  label,
  variant = "input",
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
}: FormFieldProps) {
  return (
    <label
      className={cn(
        "block text-sm font-medium text-slate-700",
        labelClassName,
        className
      )}
    >
      {label && <span className="mb-1.5 inline-block">{label}</span>}

      {variant === "select" ? (
        children ?? (
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
          />
        )
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

    </label>
  );
}
