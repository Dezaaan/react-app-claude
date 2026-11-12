import type { AuthUser } from "@/features/auth/types";
import type { Note } from "@/features/notes/types";

export const NOTES_COUNT = 100_000;

export const mockUser: AuthUser = {
  id: "8d1f0c2e-5b7a-4c1e-9f3a-2b6d4e8a1c00",
  email: "user@example.com",
  createdAt: "2026-01-15T09:30:00.000Z",
};

/** The mock login accepts any email with this password. */
export const MOCK_PASSWORD = "password";

const HOUR = 60 * 60 * 1000;

let notes: Note[] | undefined;

/** Generated once, on first use. Dates go back one hour per note. */
export const getMockNotes = (): Note[] => {
  if (!notes) {
    const now = Date.now();
    notes = Array.from({ length: NOTES_COUNT }, (_, index) => ({
      id: crypto.randomUUID(),
      title: `Note ${index + 1}`,
      content: `This is the content of note ${index + 1}`,
      createdAt: new Date(now - index * HOUR).toISOString(),
    }));
  }
  return notes;
};
