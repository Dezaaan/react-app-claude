import { useId, type MouseEventHandler } from "react";

import { formatDate } from "@/shared/utils/formatDate";
import type { Note } from "@/features/notes/types";
import styles from "./NoteItem.module.scss";

interface NoteItemProps {
  note: Note;
  handleNoteClick: MouseEventHandler<HTMLButtonElement>;
}

/** One note in the Home list: title, date and the start of the content. */
export const NoteItem = ({ note, handleNoteClick }: NoteItemProps) => {
  const id = useId();

  // Screen readers announce the title, then the date and content as extra
  // detail (otherwise the three run together into one name).
  return (
    <button
      className={styles.button}
      type="button"
      data-note-id={note.id}
      onClick={handleNoteClick}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-date ${id}-content`}
    >
      <span id={`${id}-title`} className={styles.title}>
        {note.title}
      </span>
      <time id={`${id}-date`} className={styles.date} dateTime={note.createdAt}>
        {formatDate(note.createdAt)}
      </time>
      <span id={`${id}-content`} className={styles.content}>
        {note.content}
      </span>
    </button>
  );
};
