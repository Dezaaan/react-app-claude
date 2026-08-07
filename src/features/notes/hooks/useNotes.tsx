import { useEffect, useState } from "react";

import { notesApi } from "../api/notesApi";
import type { Note } from "../types";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setIsLoading(true);

        const data = await notesApi.getNotes();

        setNotes(data);
      } catch (error) {
        setError(
          error instanceof Error ? error : new Error("Failed to load notes"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, []);

  return {
    notes,
    isLoading,
    error,
  };
};
