import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
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

const renderList = (props: Partial<ComponentProps<typeof NotesList>> = {}) => {
  const callbacks = { onEndReached: vi.fn(), onClickNoteItem: vi.fn() };
  render(
    <NotesList
      notes={notes}
      totalCount={45}
      hasMore
      isLoading={false}
      {...callbacks}
      {...props}
    />,
  );
  return callbacks;
};

describe("NotesList", () => {
  it("is a labelled list; items know their place among all notes", () => {
    renderList();

    const items = within(
      screen.getByRole("list", { name: "Notes" }),
    ).getAllByRole("listitem");
    // The row after the notes isn't a list item.
    expect(items).toHaveLength(3);
    expect(items[1]).toHaveAttribute("aria-posinset", "2");
    expect(items[1]).toHaveAttribute("aria-setsize", "45");
  });

  it("asks for more when the end comes into view", () => {
    const { onEndReached } = renderList();

    expect(onEndReached).toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("Loading more…");
  });

  it("doesn't ask while loading, after an error, or when everything is here", () => {
    for (const props of [
      { isLoading: true },
      { error: "Unable to connect to the server." },
      { hasMore: false },
    ]) {
      const { onEndReached } = renderList(props);
      expect(onEndReached).not.toHaveBeenCalled();
    }
  });

  it("offers to try again after an error", async () => {
    const { onEndReached } = renderList({
      error: "Unable to connect to the server.",
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to connect to the server.",
    );
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(onEndReached).toHaveBeenCalledTimes(1);
  });

  it("says when every note is loaded", () => {
    renderList({ hasMore: false, totalCount: 3 });

    expect(screen.getByText("That's all 3 notes.")).toBeInTheDocument();
  });

  it("opens a note from the keyboard", async () => {
    const { onClickNoteItem } = renderList({ hasMore: false });

    await userEvent.tab();
    await userEvent.keyboard("{Enter}");

    expect(onClickNoteItem).toHaveBeenCalledWith(notes[0]);
  });
});
