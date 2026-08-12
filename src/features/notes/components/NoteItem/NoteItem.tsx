import { type MouseEventHandler } from "react";
import styles from "./NoteItem.module.scss";
import type { Note } from "../../types";

interface NoteItemProps {
  note: Note;
  handleNoteClick: MouseEventHandler<HTMLButtonElement>;
}

export const NoteItem = ({ note, handleNoteClick }: NoteItemProps) => {
  return (
    <button
      className={styles.button}
      type="button"
      data-note-id={note.id}
      onClick={handleNoteClick}
    >
      {note.title}
    </button>
  );
};
