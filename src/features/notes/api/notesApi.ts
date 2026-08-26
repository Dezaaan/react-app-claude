import { ERROR_CODES } from "@/app/errors/errorCodes";
import type { Note } from "../types";
import { AppError } from "@/app/errors/AppError";

const generateNotes = (count: number): Note[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: crypto.randomUUID(),
    title: `Note ${index + 1}`,
    content: `This is the content of note ${index + 1}`,
    createdAt: new Date().toISOString(),
  }));
};

const notes: Note[] = generateNotes(40000);

//TODO this will be changed to api call
export const notesApi = {
  getNotes: async (): Promise<Note[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(
          new AppError(
            "Failed to fetch notes",
            ERROR_CODES.SERVER_ERROR,
            500,
            "Unable to load your notes.",
          ),
        );
      }, 3000);
    });
  },
};
