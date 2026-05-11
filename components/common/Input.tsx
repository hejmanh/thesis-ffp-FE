import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  suffix?: ReactNode;
  containerClassName?: string;
}

export default function Input({
  className,
  containerClassName,
  suffix,
  ...props
}: InputProps) {
  if (suffix) {
    return (
      <div className={cn("relative", containerClassName ?? "w-full")}>
        <input
          className={cn(
            "h-9 w-full rounded-full border border-gray-300 bg-white px-3 pr-7 text-sm text-slate-700 placeholder:text-slate-500 outline-none transition focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-slate-50",
            className
          )}
          {...props}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 pointer-events-none">
          {suffix}
        </span>
      </div>
    );
  }

  return (
    <input
      className={cn(
        "h-9 w-full rounded-full border border-gray-300 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-500 outline-none transition focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-slate-50",
        className
      )}
      {...props}
    />
  );
}
