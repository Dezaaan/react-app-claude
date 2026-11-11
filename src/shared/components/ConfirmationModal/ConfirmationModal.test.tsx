import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ConfirmationModal } from ".";

describe("ConfirmationModal", () => {
  it("is an alert dialog that reads out its title and question", () => {
    render(
      <ConfirmationModal
        isOpen
        title="Delete note"
        body="Are you sure you want to delete this note?"
        onCancel={() => {}}
      />,
    );

    const dialog = screen.getByRole("alertdialog", { name: "Delete note" });
    expect(dialog).toHaveAccessibleDescription(
      "Are you sure you want to delete this note?",
    );
    // The safe choice gets focus first.
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
  });
});
