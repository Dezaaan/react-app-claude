import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NoteDetailsModal } from "./NoteDetailsModal";

const note = {
  id: "1",
  title: "Note 1",
  content: "This is the content of note 1",
  createdAt: "2026-11-10T08:00:00.000Z",
  updatedAt: "2026-11-10T08:00:00.000Z",
};

describe("NoteDetailsModal", () => {
  it("renders nothing without a note", () => {
    render(<NoteDetailsModal note={null} onClose={() => {}} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows the note with a single Close action", async () => {
    const onClose = vi.fn();
    render(<NoteDetailsModal note={note} onClose={onClose} />);

    expect(screen.getByText("Note 1")).toBeInTheDocument();
    expect(screen.getByText(note.content)).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(1);

    await userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
