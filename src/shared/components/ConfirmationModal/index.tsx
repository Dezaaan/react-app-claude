import { Modal } from "../Modal";
import styles from "./ConfirmationModal.module.scss";

type ConfirmationModalProps = {
  body: string;
  cancelLabel?: string;
  confirmLabel?: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
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
  return (
    <Modal open={isOpen} onClose={onCancel} className={styles.container}>
      <Modal.Header>{title}</Modal.Header>

      <Modal.Body className={styles.body}>{body}</Modal.Body>

      <Modal.Footer>
        <button onClick={onCancel} className={styles.cancel}>
          {cancelLabel}
        </button>
        <button onClick={onConfirm} className={styles.confirm}>
          {confirmLabel}
        </button>
      </Modal.Footer>
    </Modal>
  );
};
