import { authApi } from "@/api/auth.api";
import { queryClient } from "@/lib/queryClient";
import { tokenService } from "@/services/token.service";
import { authUserService } from "@/services/authUser.service";
import { useAuthStore } from "@/store/auth.store";
import type {
  AuthUser,
  LoginPayload,
  LoginResult,
  RegisterInput,
} from "@/types/auth";

function clearClientSessionState() {
  tokenService.clear();
  authUserService.clear();
  useAuthStore.getState().clearUser();
  queryClient.clear();
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const segments = token.split(".");
  if (segments.length < 2) {
    return null;
  }

  try {
    const base64 = segments[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const binary =
      typeof window !== "undefined"
        ? window.atob(padded)
        : Buffer.from(padded, "base64").toString("binary");
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as Record<
      string,
      unknown
    >;
  } catch {
    return null;
  }
}

function extractUserFromAccessToken(token: string): AuthUser | null {
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return null;
  }

  const email =
    typeof payload.email === "string"
      ? payload.email
      : typeof payload.sub === "string" && payload.sub.includes("@")
        ? payload.sub
        : null;

  if (!email) {
    return null;
  }

  return {
    email,
    id:
      typeof payload.userId === "string"
        ? payload.userId
        : typeof payload.id === "string"
          ? payload.id
          : undefined,
    name:
      typeof payload.name === "string"
        ? payload.name
        : typeof payload.preferred_username === "string"
          ? payload.preferred_username
          : undefined,
  };
}

export const authService = {
  getAccessToken: () => tokenService.get(),

  /**
   * Register a new user. Throws on failure.
   * @throws Error with descriptive message on registration failure
   */
  async register(payload: RegisterInput): Promise<void> {
    const res = await authApi.register(payload);
    if (!res.success) throw new Error(res.error ?? "Registration failed");
  },

  /**
   * Login a user with email and password. Throws on failure.
   * On error, clears any existing auth state to ensure consistent store.
   * @throws Error with descriptive message on login failure
   */
  async login(payload: LoginPayload): Promise<LoginResult> {
    const res = await authApi.login(payload);
    if (!res.success || !res.data?.accessToken) {
      throw new Error(res.error ?? "Login failed");
    }

    try {
      tokenService.set(res.data.accessToken);
      const user = res.data.user ?? { email: payload.email };
      authUserService.set(user);
      useAuthStore.getState().setUser(user);
      return {
        isFirstLogin: res.data.isFirstLogin,
      };
    } catch (error) {
      // rollback on state update failure
      clearClientSessionState();
      throw error;
    }
  },

  /**
   * Logout the current user. Clears tokens and auth state.
   * @throws Error on logout API failure (state is still cleared)
   */
  async logout(): Promise<void> {
    let logoutError: Error | null = null;

    try {
      const res = await authApi.logout();
      if (!res.success) {
        logoutError = new Error(res.error ?? "Logout failed");
      }
    } catch (error) {
      logoutError = error instanceof Error ? error : new Error("Logout failed");
    } finally {
      clearClientSessionState();
    }

    if (logoutError) {
      throw logoutError;
    }
  },

  /**
   * Restore session from refresh token. Returns true if successful.
   * @returns true if session restored, false otherwise
   */
  async restoreSession(): Promise<boolean> {
    const res = await authApi.refresh();
    if (!res.success || !res.data?.accessToken) return false;
    const accessToken = res.data.accessToken;
    tokenService.set(accessToken);

    const restoredUser =
      authUserService.get() ?? extractUserFromAccessToken(accessToken);

    if (restoredUser) {
      authUserService.set(restoredUser);
      useAuthStore.getState().setUser(restoredUser);
    } else {
      useAuthStore.getState().setAuthenticated(true);
    }

    return true;
  },

  /**
   * Verify email with token. Throws on failure.
   * @throws Error on verification failure
   */
  async verifyEmail(token: string): Promise<void> {
    const res = await authApi.verifyEmail(token);
    if (!res.success) throw new Error(res.error ?? "Verification failed");
  },

  /**
   * Request password reset email. Throws on failure.
   * @throws Error on request failure
   */
  async forgotPassword(email: string): Promise<void> {
    const res = await authApi.forgotPassword(email);
    if (!res.success) throw new Error(res.error ?? "Request failed");
  },

  /**
   * Reset password with token. Throws on failure.
   * @throws Error on reset failure
   */
  async resetPassword(token: string, password: string): Promise<void> {
    const res = await authApi.resetPassword({ token, password });
    if (!res.success) throw new Error(res.error ?? "Reset failed");
  },
};
