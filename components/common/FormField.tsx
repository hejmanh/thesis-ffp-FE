"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import DropdownField from "@/components/common/DropdownField";
import Input from "@/components/common/Input";
import { cn } from "@/utils/cn";

type FormFieldVariant = "input" | "select";

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
  selectClassName?: string;

  hint?: ReactNode;
  children?: ReactNode;

  placeholder?: string;

  // input
  inputProps?: InputHTMLAttributes<HTMLInputElement>;

  // select (custom dropdown)
  options?: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
}

export default function FormField({
  label,
  variant = "input",
  className,
  labelClassName,
  inputClassName,
  selectClassName,
  hint,
  children,
  options = [],
  placeholder,
  inputProps,
  value,
  onChange,
}: FormFieldProps) {
  return (
    <label
      className={cn(
        "block text-sm font-medium text-slate-700",
        labelClassName,
        className
      )}
    >
      <span>{label}</span>

      {variant === "select" ? (
        children ?? (
          <DropdownField
            className={selectClassName}
            options={options}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        )
      ) : (
        <Input
          className={cn(inputClassName)}
          placeholder={placeholder}
          {...inputProps}
        />
      )}

      {hint ? (
        <p className="mt-1 text-xs text-gray-500">{hint}</p>
      ) : null}
    </label>
  );
}