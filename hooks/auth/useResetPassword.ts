"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";

export function useResetPassword() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (password: string) => {
    const token = searchParams.get("token");
    if (!token) {
      setError("Invalid reset link");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authService.resetPassword(token, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
