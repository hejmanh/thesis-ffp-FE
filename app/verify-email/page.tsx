"use client";

import Link from "next/link";
import MainLayout from "@/layouts/MainLayout";
import { useVerifyEmail } from "@/hooks";

export default function VerifyEmailPage() {
  const { status, error } = useVerifyEmail();
  const message =
    status === "pending"
      ? "Verifying your email..."
      : status === "success"
        ? "Your email has been verified. You can now log in."
        : (error ?? "Verification failed.");

  return (
    <MainLayout hideLoginButton hideRegisterButton>
      <section className="mx-auto max-w-xl px-4 py-12">
        <div className="rounded-3xl bg-white p-6 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.4)]">
          <h1 className="text-2xl font-bold text-primary">
            Email Verification
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">{message}</p>
          <div className="mt-6 flex gap-3">
            <Link
              href={status === "success" ? "/?login=1" : "/"}
              className="text-sm font-semibold text-primary underline"
            >
              {status === "success" ? "Go to login" : "Back to home"}
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
