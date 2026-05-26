"use client";

import { useCallback, useState } from "react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useUserContext } from "@/providers/UserContextProvider";
import type { LoginPayload, LoginResult, RegisterInput } from "@/types/auth";

export function useAuth() {
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
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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
