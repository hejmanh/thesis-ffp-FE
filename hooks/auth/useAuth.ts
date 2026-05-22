"use client";

import { useCallback, useState } from "react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import type { LoginPayload, LoginResult, RegisterInput } from "@/types/auth";

export function useAuth() {
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrap = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
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
    (payload: LoginPayload) => wrap<LoginResult>(() => authService.login(payload)),
    [wrap],
  );

  const register = useCallback(
    (payload: RegisterInput) => wrap(() => authService.register(payload)),
    [wrap],
  );

  const logout = useCallback(() => wrap(() => authService.logout()), [wrap]);

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
