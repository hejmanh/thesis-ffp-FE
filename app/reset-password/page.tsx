"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import MainLayout from "@/layouts/MainLayout";
import FormField from "@/components/common/FormField";
import Button from "@/components/common/Button";
import { useResetPassword } from "@/hooks";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { submit, loading, error } = useResetPassword();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage(null);

    try {
      const message = await submit(password);
      setSuccessMessage(message);
      setPassword("");
    } catch {
      // Error state comes from useResetPassword.
    }
  }

  return (
    <MainLayout hideLoginButton hideRegisterButton>
      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="relative mx-auto max-w-xl rounded-3xl bg-slate-50 p-6 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.4)] sm:p-8">
          <h1 className="text-center text-2xl font-bold text-primary">
            Reset Password
          </h1>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <FormField
              id="reset-password"
              name="password"
              label="New Password"
              variant="password"
              inputClassName="h-10 border-primary/60"
              placeholder="Enter new password"
              inputProps={{
                value: password,
                onChange: (event) => setPassword(event.target.value),
                required: true,
                autoComplete: "new-password",
                minLength: 8,
              }}
            />

            {error ? (
              <p className="text-center text-sm font-semibold text-rose-700">
                {error}
              </p>
            ) : null}
            {successMessage ? (
              <p className="text-center text-sm font-semibold text-emerald-600">
                {successMessage}
              </p>
            ) : null}

            <Button
              type="submit"
              className="h-10 w-full rounded-full"
              disabled={loading || !password.trim()}
              aria-busy={loading}
            >
              {loading ? "Resetting..." : "Reset password"}
            </Button>
          </form>

          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/?login=1"
              className="text-sm font-semibold text-primary underline"
            >
              Back to login
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
