import { create } from "zustand";
import type { AuthUser } from "@/types/auth";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  setUser: (user: AuthUser) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setAuthReady: (isAuthReady: boolean) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthReady: false,
  setUser: (user) => set({ user, isAuthenticated: true, isAuthReady: true }),
  setAuthenticated: (isAuthenticated) =>
    set((state) => ({
      isAuthenticated,
      user: isAuthenticated ? state.user : null,
      isAuthReady: true,
    })),
  setAuthReady: (isAuthReady) => set({ isAuthReady }),
  clearUser: () =>
    set({ user: null, isAuthenticated: false, isAuthReady: true }),
}));
