"use client";

import { Suspense, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";
import FormField from "@/components/common/FormField";
import Button from "@/components/common/Button";
import { useAuth } from "@/hooks";
import { useLocalizedPath, useTranslations } from "@/i18n/client";

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const toLocalizedPath = useLocalizedPath();
  const t = useTranslations("Auth.forgotPassword");
  const common = useTranslations("Common");
  const initialEmail = useMemo(() => searchParams.get("email") ?? "", [searchParams]);
  const [email, setEmail] = useState(initialEmail);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { forgotPassword, loading, error } = useAuth();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage(null);

    try {
      const message = await forgotPassword(email.trim());
      setSuccessMessage(message);
    } catch {
      // Error state comes from useAuth.
    }
  }

  return (
    <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="relative mx-auto max-w-xl rounded-3xl bg-slate-50 p-6 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.4)] sm:p-8">
        <h1 className="text-center text-2xl font-bold text-primary">{t("title")}</h1>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {t("description")}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <FormField
            id="forgot-email"
            name="email"
            label={common("email")}
            inputClassName="h-10 border-primary/60"
            placeholder={t("emailPlaceholder")}
            inputProps={{
              type: "email",
              value: email,
              onChange: (event) => setEmail(event.target.value),
              required: true,
              autoComplete: "email",
            }}
          />

          {error ? <p className="text-center text-sm font-semibold text-rose-700">{error}</p> : null}
          {successMessage ? (
            <p className="text-center text-sm font-semibold text-emerald-700">{successMessage}</p>
          ) : null}

          <Button
            type="submit"
            className="h-10 w-full rounded-full"
            disabled={loading || !email.trim()}
            aria-busy={loading}
          >
            {loading ? t("submitting") : t("submit")}
          </Button>
        </form>

        <div className="mt-6 flex justify-center gap-3">
          <Link href={toLocalizedPath("/?login=1")} className="text-sm font-semibold text-primary underline">
            {t("backToLogin")}
          </Link>
        </div>
      </div>
    </section>
  );
}

function ForgotPasswordFallback() {
  return (
    <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="relative mx-auto h-80 max-w-xl animate-pulse rounded-3xl bg-slate-50 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.4)]" />
    </section>
  );
}

export default function ForgotPasswordPage() {
  return (
    <MainLayout hideLoginButton hideRegisterButton>
      <Suspense fallback={<ForgotPasswordFallback />}>
        <ForgotPasswordForm />
      </Suspense>
    </MainLayout>
  );
}
