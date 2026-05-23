import type { AuthUser } from "@/types/auth";

const AUTH_USER_KEY = "coinfused_auth_user";

function readUserFromStorage(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (!parsed.email || typeof parsed.email !== "string") {
      return null;
    }

    return {
      email: parsed.email,
      id: typeof parsed.id === "string" ? parsed.id : undefined,
      name: typeof parsed.name === "string" ? parsed.name : undefined,
    };
  } catch {
    return null;
  }
}

function writeUserToStorage(user: AuthUser): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function clearUserFromStorage(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_USER_KEY);
}

export const authUserService = {
  get: (): AuthUser | null => readUserFromStorage(),
  set: (user: AuthUser): void => {
    writeUserToStorage(user);
  },
  clear: (): void => {
    clearUserFromStorage();
  },
};
