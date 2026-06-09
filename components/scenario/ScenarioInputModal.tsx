"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/utils/cn";
import { useTranslations } from "@/i18n/client";

interface ScenarioInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  scenarioId: string;
  children: ReactNode;
}

export default function ScenarioInputModal({
  isOpen,
  onClose,
  title,
  scenarioId,
  children,
}: ScenarioInputModalProps) {
  const t = useTranslations("Scenario");
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement;
    const timer = setTimeout(() => closeButtonRef.current?.focus(), 0);

    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    function handleFocusTrap(event: KeyboardEvent) {
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);
    window.addEventListener("keydown", handleFocusTrap);

    return () => {
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("keydown", handleFocusTrap);
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
      previouslyFocusedElement.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const labelId = `scenario-modal-${scenarioId}-title`;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4",
        "transition-all duration-300 ease-out motion-reduce:transition-none",
        "animate-in fade-in",
        "opacity-100",
      )}
      onClick={onClose}
      role="presentation"
      aria-hidden={!isOpen}
    >
      <div
        ref={modalRef}
        className={cn(
          "relative w-full max-w-lg rounded-3xl bg-white p-5 shadow-xl",
          "transition-all duration-300 ease-out motion-reduce:transform-none motion-reduce:transition-none",
          "animate-in slide-in-from-bottom-4 zoom-in-95",
          "translate-y-0 scale-100 opacity-100",
          "max-h-[90vh] overflow-y-auto sm:p-6",
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">
              {t("label", { id: scenarioId })}
            </span>
            <h2
              id={labelId}
              className="mt-1.5 text-lg font-semibold text-slate-900"
            >
              {title}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={t("closeModal")}
            className="mt-0.5 flex-shrink-0 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <Icon icon="mdi:close" className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
