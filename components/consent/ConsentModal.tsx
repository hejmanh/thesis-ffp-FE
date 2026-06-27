"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import Button from "@/components/common/Button";
import { useRecordConsent } from "@/hooks/consent/useConsent";
import { useTranslations } from "@/i18n/client";
import { cn } from "@/utils/cn";

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsented: (agreed: boolean) => void;
}

const CONSENT_VERSION = "v1";
const CONSENT_POINTS = ["1", "2", "3", "4", "5", "6"] as const;
const AGREEMENT_POINTS = ["1", "2", "3"] as const;

export default function ConsentModal({
  isOpen,
  onClose,
  onConsented,
}: ConsentModalProps) {
  const t = useTranslations("Consent");
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: recordConsent } = useRecordConsent();

  useEffect(() => {
    if (!isOpen) return;

    function handleFocusTrap(event: KeyboardEvent) {
      if (event.key !== "Tab" || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }
    return () => {
      window.removeEventListener("keydown", handleFocusTrap);
    };
  }, [isOpen]);

  async function handleChoice(agreed: boolean) {
    setIsSubmitting(true);
    setError(null);
    try {
      await recordConsent({ agreed, consentVersion: CONSENT_VERSION });
      onConsented(agreed);
      onClose();
    } catch {
      setError(t("errorMsg"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className={cn("fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4")}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl rounded-3xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-modal-title"
      >
        <div className="max-h-[90vh] overflow-y-auto p-6 sm:p-8">
          <div className="mb-6 text-center">
            <div className="mb-3 flex justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon icon="mdi:shield-check-outline" className="h-6 w-6 text-primary" />
              </span>
            </div>
            <h2 id="consent-modal-title" className="text-2xl font-bold text-slate-900">
              {t("title")}
            </h2>
            <p className="mt-1 text-sm font-semibold text-primary">{t("subtitle")}</p>
          </div>

          <p className="mb-4 text-sm text-slate-600">{t("intro")}</p>

          <p className="mb-3 text-sm font-medium text-slate-700">{t("byParticipating")}</p>

          <ul className="mb-6 space-y-3">
            {CONSENT_POINTS.map((n) => (
              <li key={n} className="flex gap-3 text-sm text-slate-600">
                <Icon icon="mdi:circle-small" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{t(`points.${n}`)}</span>
              </li>
            ))}
          </ul>

          <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="mb-2 text-sm font-semibold text-slate-700">{t("byAgreeing")}</p>
            <ul className="space-y-1.5">
              {AGREEMENT_POINTS.map((n) => (
                <li key={n} className="flex gap-2 text-sm text-slate-600">
                  <Icon icon="mdi:check" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{t(`agreementPoints.${n}`)}</span>
                </li>
              ))}
            </ul>
          </div>

          {error ? (
            <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => handleChoice(false)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Icon icon="mdi:loading" className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {t("noBtn")}
            </Button>
            <Button
              variant="primary"
              className="w-full sm:w-auto"
              onClick={() => handleChoice(true)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Icon icon="mdi:loading" className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {t("agreeBtn")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
