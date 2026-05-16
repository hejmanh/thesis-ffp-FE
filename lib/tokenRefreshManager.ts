// ensure only one token refresh is in progress at a time

type RefreshFn = () => Promise<string>;

class TokenRefreshManager {
  private refreshPromise: Promise<string> | null = null;

  async getValidToken(refreshFn: RefreshFn): Promise<string> {
    // return existing refresh if in progress
    if (this.refreshPromise) return this.refreshPromise;

    // start new refresh and clear on completion
    this.refreshPromise = refreshFn().finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }
}

export const tokenRefreshManager = new TokenRefreshManager();
