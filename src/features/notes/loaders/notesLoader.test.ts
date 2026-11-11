import { describe, expect, it, vi } from "vitest";

import { notesApi } from "../api/notesApi";
import type { Note } from "../types";
import { notesLoader } from "./notesLoader";

describe("notesLoader", () => {
  it("returns the notes from the API", async () => {
    const notes: Note[] = [
      { id: "1", title: "A", content: "a", createdAt: "2026-01-01" },
    ];
    vi.spyOn(notesApi, "getNotes").mockResolvedValue(notes);

    await expect(notesLoader()).resolves.toEqual({ notes });
  });

  it("lets API errors propagate to the route's error element", async () => {
    vi.spyOn(notesApi, "getNotes").mockRejectedValue(new Error("boom"));

    await expect(notesLoader()).rejects.toThrow("boom");
  });
});
