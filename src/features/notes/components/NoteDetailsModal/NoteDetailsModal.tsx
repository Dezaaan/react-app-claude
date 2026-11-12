import { Modal } from "@/shared/components/Modal";
import type { Note } from "@/features/notes/types";
import styles from "./NoteDetailsModal.module.scss";

type NoteDetailsModalProps = {
  note: Note | null;
  onClose: () => void;
};

export const NoteDetailsModal = ({ note, onClose }: NoteDetailsModalProps) => {
  return (
    <Modal open={note !== null} onClose={onClose} className={styles.container}>
      <Modal.Header>{note?.title}</Modal.Header>

      <Modal.Body className={styles.body}>{note?.content}</Modal.Body>

      <Modal.Footer>
        <button type="button" onClick={onClose} className={styles.close}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};
