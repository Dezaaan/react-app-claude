import type { AuthUser } from "../types";

//TODO this will be changed to api call
export const authApi = {
  getCurrentUser: async (): Promise<AuthUser | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // resolve({ id: "1", email: "user@example.com", role: "user" });
        resolve(null);
      }, 500);
    });
  },
};
