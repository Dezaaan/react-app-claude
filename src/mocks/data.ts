import type { AuthUser } from "@/features/auth/types";
import type { Note } from "@/features/notes/types";

/** Enough for many pages (20 per page by default) and infinite scrolling. */
export const NOTES_COUNT = 1_000;

export const mockUser: AuthUser = {
  id: "8d1f0c2e-5b7a-4c1e-9f3a-2b6d4e8a1c00",
  email: "user@example.com",
  createdAt: "2026-01-15T09:30:00.000Z",
};

/** The mock login accepts any email with this password. */
export const MOCK_PASSWORD = "password";

const HOUR = 60 * 60 * 1000;

let notes: Note[] | undefined;

/**
 * Generated once, on first use. Created one hour apart, newest first; every
 * third note was edited later, so sorting by updatedAt differs.
 */
export const getMockNotes = (): Note[] => {
  if (!notes) {
    const now = Date.now();
    notes = Array.from({ length: NOTES_COUNT }, (_, index) => {
      const created = now - index * HOUR;
      const updated = index % 3 === 0 ? created + 30 * 60 * 1000 : created;

      return {
        id: crypto.randomUUID(),
        title: `Note ${index + 1}`,
        content: `This is the content of note ${index + 1}`,
        createdAt: new Date(created).toISOString(),
        updatedAt: new Date(updated).toISOString(),
      };
    });
  }
  return notes;
};
