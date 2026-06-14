"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Button from "@/components/common/Button";
import FormField from "@/components/common/FormField";
import { useAuth } from "@/hooks";
import { ApiClientError } from "@/lib/ApiClientError";
import { cn } from "@/utils/cn";
import { useLocaleRouter, useLocalizedPath, useTranslations } from "@/i18n/client";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useLocaleRouter();
  const toLocalizedPath = useLocalizedPath();
  const t = useTranslations("Auth.login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const { login, resendVerificationEmail, loading, error } = useAuth();

  useEffect(() => {
    if (!isOpen) return;

    // Store the previously focused element to restore later
    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    // Focus the close button as initial focus
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    function handleFocusTrap(event: KeyboardEvent) {
      if (event.key !== "Tab" || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

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

    // Prevent body scroll when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleEsc);
    window.addEventListener("keydown", handleFocusTrap);

    return () => {
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("keydown", handleFocusTrap);
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
      // Restore focus to the previously focused element
      previouslyFocusedElement.current?.focus();
    };
  }, [isOpen, onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowResendVerification(false);
    setResendMessage("");
    try {
      const result = await login({ email, password });
      if (result.isFirstLogin) {
        onClose();
        router.push("/onboarding");
        return;
      }
      onClose();
    } catch (submitError) {
      if (
        submitError instanceof ApiClientError &&
        submitError.code === "AUTH.EMAIL_NOT_VERIFIED"
      ) {
        setShowResendVerification(true);
      }
    }
  }

  async function handleResendVerification() {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    setResendMessage("");
    try {
      await resendVerificationEmail(trimmedEmail);
      setResendMessage(t("resendSuccess"));
    } catch {
      setResendMessage(t("resendFailed"));
    }
  }

  if (!isOpen) return null;

  return (
    <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 transition-opacity duration-200 ease-out motion-reduce:transition-none",
          "opacity-100",
        )}
      onClick={onClose}
      role="presentation"
      aria-hidden={!isOpen}
    >
      <div
        ref={modalRef}
        className={cn(
          "w-full max-w-xl rounded-3xl bg-white p-5 shadow-xl transition-all duration-200 ease-out motion-reduce:transform-none motion-reduce:transition-none sm:p-6",
          "translate-y-0 scale-100 opacity-100",
        )}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 text-center">
            <h2 id="login-modal-title" className="text-4xl font-bold text-primary">
              {t("title")}
            </h2>
            <p id="login-modal-description" className="mt-2 text-sm text-muted-foreground">
              {t("description")}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="flex h-8 w-8 items-center justify-center rounded transition hover:bg-gray-100"
          >
            <Icon icon="mdi:close" className="h-6 w-6 text-slate-500" />
          </button>
        </div>
        <form className="mx-auto mt-6 w-full max-w-md space-y-4" onSubmit={handleSubmit}>
          <FormField
            id="email"
            name="email"
            label={t("username")}
            inputClassName="h-10 border-primary/60"
            placeholder={t("usernamePlaceholder")}
            inputProps={{
              type: "email",
              value: email,
              onChange: (event) => setEmail(event.target.value),
              required: true,
              autoComplete: "email",
            }}
          />
          <FormField
            id="login-password"
            name="password"
            label={t("password")}
            variant="password"
            inputClassName="h-10 border-primary/60"
            placeholder={t("passwordPlaceholder")}
            inputProps={{
              value: password,
              onChange: (event) => setPassword(event.target.value),
              required: true,
              autoComplete: "current-password",
            }}
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {showResendVerification ? (
            <p className="text-sm text-muted-foreground">
              {t("resendHint")}{" "}
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={loading || !email.trim()}
                className="font-semibold text-primary underline disabled:cursor-not-allowed disabled:text-muted-foreground"
              >
                {loading ? t("resendingVerification") : t("resendVerification")}
              </button>
              {resendMessage ? (
                <p className="font-semibold text-emerald-700">
                  {resendMessage}
                </p>
              ) : null}
            </p>
          ) : null}
          <button
            type="button"
            className="text-sm font-semibold text-primary underline"
            onClick={() => {
              onClose();
              const query = email.trim()
                ? `?email=${encodeURIComponent(email.trim())}`
                : "";
              router.push(`/forgot-password${query}`);
            }}
          >
            {t("forgotPassword")}
          </button>
          <Button
            type="submit"
            className="h-10 w-full rounded-full"
            disabled={loading || !email || !password}
            aria-busy={loading}
          >
            <span className="inline-flex items-center gap-2 transition-opacity duration-200">
              {loading ? (
                <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" />
              ) : null}
              <span>{loading ? t("submitting") : t("submit")}</span>
            </span>
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t("noAccount")}{" "}
            <Link href={toLocalizedPath("/register")} className="font-semibold text-primary underline">
              {t("signUp")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
