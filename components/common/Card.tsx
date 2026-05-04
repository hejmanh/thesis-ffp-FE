import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export default function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-surface shadow-[0_10px_24px_-18px_rgba(15,23,42,0.35)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_36px_-20px_rgba(15,23,42,0.45)]",
        className
      )}
      {...props}
    />
  );
}
