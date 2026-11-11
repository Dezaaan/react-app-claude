import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Modal } from "./Modal";

const renderModal = (props: { closeOnOverlayClick?: boolean } = {}) => {
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
});
