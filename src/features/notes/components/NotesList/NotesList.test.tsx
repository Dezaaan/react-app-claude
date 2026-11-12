import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { Note } from "@/features/notes/types";
import { NotesList } from "./NotesList";

const notes: Note[] = Array.from({ length: 3 }, (_, index) => ({
  id: String(index + 1),
  title: `Note ${index + 1}`,
  content: `Content ${index + 1}`,
  createdAt: "2026-11-10T08:00:00.000Z",
  updatedAt: "2026-11-10T08:00:00.000Z",
}));

describe("NotesList", () => {
  it("is a labelled list whose items know their position", () => {
    render(<NotesList notes={notes} onClickNoteItem={() => {}} />);

    const items = within(
      screen.getByRole("list", { name: "Notes" }),
    ).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[1]).toHaveAttribute("aria-posinset", "2");
    expect(items[1]).toHaveAttribute("aria-setsize", "3");
  });

  it("opens a note from the keyboard", async () => {
    const onClickNoteItem = vi.fn();
    render(<NotesList notes={notes} onClickNoteItem={onClickNoteItem} />);

    await userEvent.tab();
    await userEvent.keyboard("{Enter}");

    expect(onClickNoteItem).toHaveBeenCalledWith(notes[0]);
  });
});
