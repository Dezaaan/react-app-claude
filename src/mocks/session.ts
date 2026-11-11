/**
 * Whether the mock backend considers you logged in. Kept in sessionStorage
 * so logging out survives a page reload (a real backend would use a cookie).
 * Starts logged in so `npm run dev` opens straight into the app.
 */
const STORAGE_KEY = "mock-api:logged-in";

let loggedIn = true;

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
  logOut: () => write(false),
  /** For tests: back to the default, logged-in state. */
  reset: () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Same as above.
    }
    loggedIn = true;
  },
};
