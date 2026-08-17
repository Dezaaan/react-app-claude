import type { Note } from "../types";

const generateNotes = (count: number): Note[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: crypto.randomUUID(),
    title: `Note ${index + 1}`,
    content: `This is the content of note ${index + 1}`,
    createdAt: new Date().toISOString(),
  }));
};

const notes: Note[] = generateNotes(1000);

//TODO this will be changed to api call
export const notesApi = {
  getNotes: async (): Promise<Note[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(notes);
      }, 500);
    });
  },
};
