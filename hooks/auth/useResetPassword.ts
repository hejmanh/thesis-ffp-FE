"use client";

import { useState } from "react";
import { authService } from "@/services/auth.service";
import { useTranslations } from "@/i18n/client";
import { useApiErrorMessage } from "@/hooks/useApiErrorMessage";

export function useResetPassword() {
  const t = useTranslations("Auth.resetPassword");
  const getApiErrorMessage = useApiErrorMessage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (password: string): Promise<string> => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setError(t("invalidLink"));
      throw new Error(t("invalidLink"));
    }

    setLoading(true);
    setError(null);

    try {
      return await authService.resetPassword(token, password);
    } catch (err) {
      setError(getApiErrorMessage(err, t("failed")));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
