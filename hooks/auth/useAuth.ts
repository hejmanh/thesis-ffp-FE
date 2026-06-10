"use client";

import { useCallback, useState } from "react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useUserContext } from "@/providers/UserContextProvider";
import type { LoginPayload, LoginResult, RegisterInput } from "@/types/auth";
import { useTranslations } from "@/i18n/client";
import { useApiErrorMessage } from "@/hooks/useApiErrorMessage";

export function useAuth() {
  const t = useTranslations("Auth.errors");
  const getApiErrorMessage = useApiErrorMessage();
  const { user, isAuthenticated } = useAuthStore();
  const { refresh, clear } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrap = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      const message = getApiErrorMessage(err, t("fallback"));
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getApiErrorMessage, t]);

  const login = useCallback(
    (payload: LoginPayload) =>
      wrap<LoginResult>(async () => {
        const result = await authService.login(payload);
        await refresh();
        return result;
      }),
    [refresh, wrap],
  );

  const register = useCallback(
    (payload: RegisterInput) => wrap(() => authService.register(payload)),
    [wrap],
  );

  const logout = useCallback(
    () =>
      wrap(async () => {
        await authService.logout();
        clear();
      }),
    [clear, wrap],
  );

  const forgotPassword = useCallback(
    (email: string) => wrap(() => authService.forgotPassword(email)),
    [wrap],
  );

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    forgotPassword,
    loading,
    error,
  };
}
