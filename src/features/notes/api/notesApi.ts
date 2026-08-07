import type { Note } from "../types";

const notes: Note[] = [
  {
    id: "1",
    title: "First note",
    content: "This is my first note.",
    createdAt: "2026-08-01",
  },
  {
    id: "2",
    title: "React architecture",
    content: "Separate pages, features and shared components.",
    createdAt: "2026-08-02",
  },
  {
    id: "3",
    title: "API layer",
    content: "The API layer should hide HTTP details from components.",
    createdAt: "2026-08-03",
  },
];

//TODO this will be changed to api call
export const notesApi = {
  getNotes: async (): Promise<Note[]> => {
    return notes;
  },
};
