import { useId } from "react";

import { Modal } from "@/shared/components/Modal";
import styles from "./ConfirmationModal.module.scss";

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
      className={styles.container}
      role="alertdialog"
      aria-describedby={bodyId}
    >
      <Modal.Header>{title}</Modal.Header>

      <Modal.Body id={bodyId} className={styles.body}>
        {body}
      </Modal.Body>

      <Modal.Footer>
        <button type="button" onClick={onCancel} className={styles.cancel}>
          {cancelLabel}
        </button>
        <button type="button" onClick={onConfirm} className={styles.confirm}>
          {confirmLabel}
        </button>
      </Modal.Footer>
    </Modal>
  );
};
