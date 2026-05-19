import { authApi } from "@/api/auth.api";
import { tokenService } from "@/services/token.service";
import { useAuthStore } from "@/store/auth.store";
import type { LoginPayload, RegisterInput } from "@/types/auth";

export const authService = {
  getAccessToken: () => tokenService.get(),

  async register(payload: RegisterInput) {
    const res = await authApi.register(payload);
    if (!res.success) throw new Error(res.error ?? "Registration failed");
    return res.message;
  },

  async login(payload: LoginPayload) {
    const res = await authApi.login(payload);
    if (!res.success || !res.data?.accessToken) {
      throw new Error(res.error ?? "Login failed");
    }

    tokenService.set(res.data.accessToken);
    useAuthStore.getState().setUser(res.data.user ?? { email: payload.email });
  },

  async logout() {
    await authApi.logout();
    tokenService.clear();
    useAuthStore.getState().clearUser();
  },

  async restoreSession(): Promise<boolean> {
    const res = await authApi.refresh();
    if (!res.success || !res.data?.accessToken) return false;
    tokenService.set(res.data.accessToken);
    useAuthStore.getState().setAuthenticated(true);
    return true;
  },

  async verifyEmail(token: string) {
    const res = await authApi.verifyEmail(token);
    if (!res.success) throw new Error(res.error ?? "Verification failed");
  },

  async forgotPassword(email: string) {
    const res = await authApi.forgotPassword(email);
    if (!res.success) throw new Error(res.error ?? "Request failed");
  },

  async resetPassword(token: string, password: string) {
    const res = await authApi.resetPassword({ token, password });
    if (!res.success) throw new Error(res.error ?? "Reset failed");
  },
};
