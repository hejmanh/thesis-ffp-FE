import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export default function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-primary-soft px-4 py-1 text-xs font-semibold tracking-wide text-primary",
        className
      )}
      {...props}
    />
  );
}
