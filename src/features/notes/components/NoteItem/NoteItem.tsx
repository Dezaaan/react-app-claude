import { memo } from "react";
import styles from "./NoteItem.module.scss";
import type { Note } from "../../types";

interface NoteItemProps {
  note: Note;
}

export const NoteItem = memo(({ note }: NoteItemProps) => {
  return (
    <button className={styles.button} type="button">
      {note.title}
    </button>
  );
});
