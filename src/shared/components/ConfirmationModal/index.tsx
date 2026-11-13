import { useId } from "react";

import { Button } from "@/shared/components/Button/Button";
import { Modal } from "@/shared/components/Modal";

type ConfirmationModalProps = {
  body: string;
  cancelLabel?: string;
  confirmLabel?: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm?: () => void;
  title: string;
};

export const ConfirmationModal = ({
  isOpen,
  title,
  body,
  onConfirm,
  onCancel,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
}: ConfirmationModalProps) => {
  const bodyId = useId();

  // "alertdialog" tells screen readers this needs an answer, and reads the
  // question (the body) together with the title.
  return (
    <Modal
      open={isOpen}
      onClose={onCancel}
      role="alertdialog"
      aria-describedby={bodyId}
    >
      <Modal.Header>{title}</Modal.Header>

      <Modal.Body id={bodyId}>{body}</Modal.Body>

      <Modal.Footer>
        <Button onClick={onCancel}>{cancelLabel}</Button>
        <Button variant="primary" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
