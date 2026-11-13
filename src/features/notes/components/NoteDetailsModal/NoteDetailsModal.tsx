import { Button } from "@/shared/components/Button/Button";
import { Modal } from "@/shared/components/Modal";
import type { Note } from "@/features/notes/types";
import styles from "./NoteDetailsModal.module.scss";

type NoteDetailsModalProps = {
  note: Note | null;
  onClose: () => void;
};

export const NoteDetailsModal = ({ note, onClose }: NoteDetailsModalProps) => {
  return (
    <Modal open={note !== null} onClose={onClose}>
      <Modal.Header>{note?.title}</Modal.Header>

      <Modal.Body className={styles.content}>{note?.content}</Modal.Body>

      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};
