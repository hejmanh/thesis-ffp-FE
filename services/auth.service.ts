import { authApi } from "@/api/auth.api";
import { tokenService } from "@/services/token.service";
import { useAuthStore } from "@/store/auth.store";
import type { LoginPayload, RegisterInput } from "@/types/auth";

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
  async login(payload: LoginPayload): Promise<void> {
    const res = await authApi.login(payload);
    if (!res.success || !res.data?.accessToken) {
      throw new Error(res.error ?? "Login failed");
    }

    try {
      tokenService.set(res.data.accessToken);
      useAuthStore.getState().setUser(res.data.user ?? { email: payload.email });
    } catch (error) {
      // rollback on state update failure
      tokenService.clear();
      useAuthStore.getState().clearUser();
      throw error;
    }
  },

  /**
   * Logout the current user. Clears tokens and auth state.
   * @throws Error on logout API failure (state is still cleared)
   */
  async logout(): Promise<void> {
    await authApi.logout();
    tokenService.clear();
    useAuthStore.getState().clearUser();
  },

  /**
   * Restore session from refresh token. Returns true if successful.
   * @returns true if session restored, false otherwise
   */
  async restoreSession(): Promise<boolean> {
    const res = await authApi.refresh();
    if (!res.success || !res.data?.accessToken) return false;
    tokenService.set(res.data.accessToken);
    useAuthStore.getState().setAuthenticated(true);
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
