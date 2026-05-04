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
  id?: string;
  name?: string;

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
      ) : (
        <Input
          id={id}
          name={name}
          className={cn(inputClassName)}
          placeholder={placeholder}
          {...inputProps}
        />
      )}

    </label>
  );
}