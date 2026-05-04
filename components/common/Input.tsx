import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export default function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-full border border-primary-soft bg-primary-soft/70 px-3 text-sm text-slate-700 placeholder:text-slate-500 outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    />
  );
}
