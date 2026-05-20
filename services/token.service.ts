const ACCESS_TOKEN_KEY = "coinfused_access_token";

let accessToken: string | null = null;

function readTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

function writeTokenToStorage(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

function clearTokenFromStorage(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export const tokenService = {
  get: (): string | null => {
    if (accessToken) return accessToken;
    const persistedToken = readTokenFromStorage();
    if (persistedToken) {
      accessToken = persistedToken;
    }
    return accessToken;
  },
  set: (token: string): void => {
    accessToken = token;
    writeTokenToStorage(token);
  },
  clear: (): void => {
    accessToken = null;
    clearTokenFromStorage();
  },
};
