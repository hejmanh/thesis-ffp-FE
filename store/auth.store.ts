import { create } from "zustand";
import type { AuthUser } from "@/types/auth";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  setAuthenticated: (isAuthenticated) =>
    set((state) => ({
      isAuthenticated,
      user: isAuthenticated ? state.user : null,
    })),
  clearUser: () => set({ user: null, isAuthenticated: false }),
}));
