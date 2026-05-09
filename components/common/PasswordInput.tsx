"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/utils/cn";

export default function PasswordInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={isVisible ? "text" : "password"}
        className={cn(
          "h-9 w-full rounded-full border border-gray-300 bg-white px-3 pr-10 text-sm text-slate-700 placeholder:text-slate-500 outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        aria-label={isVisible ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center text-slate-500 transition hover:text-slate-700"
      >
        <Icon
          icon={isVisible ? "mdi:eye-off-outline" : "mingcute:eye-2-line"}
          className="h-5 w-5"
        />
      </button>
    </div>
  );
}
