import type { AuthUser, Permission } from "@/features/auth/types";
import type { Note } from "@/features/notes/types";

export const NOTES_COUNT = 100_000;

export const mockUser: AuthUser = {
  id: "1",
  email: "user@example.com",
  role: "user",
};

export const mockPermissions: Permission[] = [];

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
