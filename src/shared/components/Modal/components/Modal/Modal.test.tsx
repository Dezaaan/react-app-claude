import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Modal } from "./Modal";

const renderModal = (
  props: { closeOnOverlayClick?: boolean; closeOnEscape?: boolean } = {},
) => {
  const onClose = vi.fn();
  render(
    <Modal open onClose={onClose} {...props}>
      <Modal.Body>Modal content</Modal.Body>
    </Modal>,
  );
  // The overlay is the portal's root element inside document.body.
  const overlay =
    screen.getByText("Modal content").parentElement!.parentElement!;
  return { onClose, overlay };
};

describe("Modal", () => {
  it("renders nothing when closed", () => {
    render(
      <Modal open={false} onClose={() => {}}>
        Hidden
      </Modal>,
    );

    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("closes when the overlay is clicked", async () => {
    const { onClose, overlay } = renderModal();

    await userEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when the content is clicked", async () => {
    const { onClose } = renderModal();

    await userEvent.click(screen.getByText("Modal content"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("stays open on overlay click when closeOnOverlayClick is false", async () => {
    const { onClose, overlay } = renderModal({ closeOnOverlayClick: false });

    await userEvent.click(overlay);

    expect(onClose).not.toHaveBeenCalled();
    expect(overlay).not.toHaveAttribute("closeOnOverlayClick");
  });

  it("is a dialog named by its header", () => {
    render(
      <Modal open onClose={() => {}}>
        <Modal.Header>Delete note</Modal.Header>
      </Modal>,
    );

    expect(screen.getByRole("dialog", { name: "Delete note" })).toHaveAttribute(
      "aria-modal",
      "true",
    );
  });

  it("closes on Escape", async () => {
    const { onClose } = renderModal();

    await userEvent.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("stays open on Escape when closeOnEscape is false", async () => {
    const { onClose } = renderModal({ closeOnEscape: false });

    await userEvent.keyboard("{Escape}");

    expect(onClose).not.toHaveBeenCalled();
  });

  it("moves focus in on open, keeps Tab inside, and returns focus on close", async () => {
    const Example = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
          <button type="button">Behind the modal</button>
          <Modal open={open} onClose={() => setOpen(false)}>
            <Modal.Header>Title</Modal.Header>
            <Modal.Footer>
              <button type="button">First</button>
              <button type="button" onClick={() => setOpen(false)}>
                Last
              </button>
            </Modal.Footer>
          </Modal>
        </>
      );
    };
    render(<Example />);
    const opener = screen.getByRole("button", { name: "Open" });

    await userEvent.click(opener);
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Last" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Last" })).toHaveFocus();

    await userEvent.keyboard("{Enter}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("locks page scrolling while open", () => {
    const { rerender } = render(
      <Modal open onClose={() => {}}>
        Content
      </Modal>,
    );
    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <Modal open={false} onClose={() => {}}>
        Content
      </Modal>,
    );
    expect(document.body.style.overflow).toBe("");
  });
});
