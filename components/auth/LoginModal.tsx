"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";
import FormField from "@/components/common/FormField";
import { login } from "@/services/auth/mockAuth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    function onEsc(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 text-center">
            <h2 className="text-4xl font-bold text-primary">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">Let&apos;s explore the app again with us.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close login modal"
            className="text-3xl leading-none text-slate-500 hover:text-slate-700"
          >
            ×
          </button>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <FormField
            label="Username"
            inputClassName="h-11 border-primary/60"
            placeholder="Enter your username"
            inputProps={{
              type: "email",
              value: email,
              onChange: (event) => setEmail(event.target.value),
              required: true,
            }}
          />
          <FormField
            label="Password"
            inputClassName="h-11 border-primary/60"
            placeholder="Enter your password"
            inputProps={{
              type: "password",
              value: password,
              onChange: (event) => setPassword(event.target.value),
              required: true,
            }}
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="button" className="text-sm font-semibold text-primary">
            Forgot password?
          </button>
          <Button
            type="submit"
            className="h-11 w-full rounded-full"
            disabled={loading || !email || !password}
          >
            {loading ? "Logging in..." : "Log in"}
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
