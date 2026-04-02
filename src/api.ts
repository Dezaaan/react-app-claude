import type { Note } from "./models";

const BASE_URL = "http://localhost:3000/dev";

export const getNotes = async (): Promise<Note[]> => {
  const res = await fetch(`${BASE_URL}/notes`);
  return res.json();
};

export const createNote = async (note: Note): Promise<Note> => {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });

  return res.json();
};
