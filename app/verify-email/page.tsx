"use client";

import Link from "next/link";
import MainLayout from "@/layouts/MainLayout";
import { useVerifyEmail } from "@/hooks";
import { useLocalizedPath, useTranslations } from "@/i18n/client";

export default function VerifyEmailPage() {
  const toLocalizedPath = useLocalizedPath();
  const t = useTranslations("Auth.verifyEmail");
  const { status, error } = useVerifyEmail();
  const message =
    status === "pending"
      ? t("pending")
      : status === "success"
        ? t("success")
        : (error ?? t("failed"));

  return (
    <MainLayout hideLoginButton hideRegisterButton>
      <section className="mx-auto max-w-xl px-4 py-12">
        <div className="rounded-3xl bg-white p-6 text-center shadow-[0_20px_50px_-25px_rgba(15,23,42,0.4)]">
          {/* <h1 className="text-2xl font-bold text-primary">
            Email Verification
          </h1> */}
          <p className="mt-3 text-sm text-muted-foreground">{message}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href={toLocalizedPath(status === "success" ? "/?login=1" : "/")}
              className="text-sm font-semibold text-primary underline"
            >
              {status === "success" ? t("goToLogin") : t("backToHome")}
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
