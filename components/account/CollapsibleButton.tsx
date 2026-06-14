"use client";

import { Icon } from "@iconify/react";
import { cn } from "@/utils/cn";

interface CollapsibleButtonProps {
  isOpen: boolean;
  controlsId: string;
  onToggle: () => void;
}

export default function CollapsibleButton({
  isOpen,
  controlsId,
  onToggle,
}: CollapsibleButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={controlsId}
      aria-label={isOpen ? "Close account menu" : "Open account menu"}
      className={cn(
        "fixed bottom-5 right-5 z-[60] inline-flex h-15 w-15 items-center justify-center rounded-full border border-border bg-white text-slate-700 shadow-lg transition hover:bg-primary-soft lg:hidden",
        isOpen && "shadow-lg",
      )}
    >
      <Icon icon="mdi:menu" className="h-9 w-9" />
    </button>
  );
}
