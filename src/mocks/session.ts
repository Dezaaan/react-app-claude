/**
 * The mock backend's session, standing in for the refresh-token cookie and
 * the access tokens. "Logged in" is kept in sessionStorage so logging out
 * survives a page reload, like the real cookie would. Starts logged in so
 * `npm run dev` opens straight into the app.
 */
const STORAGE_KEY = "mock-api:logged-in";

let loggedIn = true;
let currentToken: string | null = null;
let issuedTokens = 0;

const read = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      loggedIn = stored === "true";
    }
  } catch {
    // Storage unavailable (e.g. privacy mode): keep the in-memory value.
  }
  return loggedIn;
};

const write = (value: boolean) => {
  loggedIn = value;
  try {
    sessionStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // Same as above.
  }
};

export const mockSession = {
  isLoggedIn: read,

  logIn: () => write(true),

  logOut: () => {
    write(false);
    currentToken = null;
  },

  /** A new access token; the previous one stops working, like expiring. */
  issueToken: () => {
    issuedTokens += 1;
    currentToken = `mock-access-token-${issuedTokens}`;
    return currentToken;
  },

  /** Makes the current access token invalid, as if 15 minutes passed. */
  expireToken: () => {
    currentToken = null;
  },

  /** Whether the request carries the current access token. */
  isAuthorized: (request: Request) =>
    read() &&
    currentToken !== null &&
    request.headers.get("Authorization") === `Bearer ${currentToken}`,

  /** For tests: back to the default, logged-in state. */
  reset: () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Same as above.
    }
    loggedIn = true;
    currentToken = null;
  },
};
