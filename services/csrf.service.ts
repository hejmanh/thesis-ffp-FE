export const csrfService = {
  get: (): string | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(?:^|;\s*)csrfToken=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  },
};
