/**
 * The current access token. Kept in memory only (never localStorage), so
 * other scripts on the page can't read it from storage; a reload clears it
 * and the app gets a new one with the refresh cookie.
 */
let token: string | null = null;

export const accessToken = {
  get: () => token,
  set: (value: string) => {
    token = value;
  },
  clear: () => {
    token = null;
  },
};
