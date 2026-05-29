"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Button from "@/components/common/Button";
import FormField from "@/components/common/FormField";
import { useAuth } from "@/hooks";
import { cn } from "@/utils/cn";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const { login, loading, error } = useAuth();

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
    try {
      const result = await login({ email, password });
      if (result.isFirstLogin) {
        onClose();
        router.push("/onboarding");
        return;
      }
      onClose();
    } catch {
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
              Welcome back
            </h2>
            <p id="login-modal-description" className="mt-2 text-sm text-muted-foreground">
              Let&apos;s explore the app again with us.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close login modal"
            className="flex h-8 w-8 items-center justify-center rounded transition hover:bg-gray-100"
          >
            <Icon icon="mdi:close" className="h-6 w-6 text-slate-500" />
          </button>
        </div>
        <form className="mx-auto mt-6 w-full max-w-md space-y-4" onSubmit={handleSubmit}>
          <FormField
            id="email"
            name="email"
            label="Username"
            inputClassName="h-10 border-primary/60"
            placeholder="Enter your username"
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
            label="Password"
            variant="password"
            inputClassName="h-10 border-primary/60"
            placeholder="Enter your password"
            inputProps={{
              value: password,
              onChange: (event) => setPassword(event.target.value),
              required: true,
              autoComplete: "current-password",
            }}
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
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
            Forgot password?
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
              <span>{loading ? "Logging in..." : "Log in"}</span>
            </span>
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
