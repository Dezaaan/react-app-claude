import { notesApi } from "../api/notesApi";

export const notesLoader = async () => {
  const notes = await notesApi.getNotes();

  return {
    notes,
  };
};
