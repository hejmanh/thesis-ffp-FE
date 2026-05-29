"use client";

import { useState } from "react";
import { authService } from "@/services/auth.service";

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (password: string): Promise<string> => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setError("Invalid reset link");
      throw new Error("Invalid reset link");
    }

    setLoading(true);
    setError(null);

    try {
      return await authService.resetPassword(token, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
