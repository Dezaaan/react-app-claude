import styles from "./NotesList.module.scss";
import type { Note } from "../../types";
import { memo, useCallback, useMemo } from "react";
import { NoteRow } from "./NoteRow";
import { List } from "react-window";

type NotesListProps = {
  notes: Note[];
  onClickNoteItem: (note: Note) => void;
};

export const NotesList = memo(({ notes, onClickNoteItem }: NotesListProps) => {
  const handleNoteClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const element = event.target as HTMLElement;

      const noteElement = element.closest<HTMLElement>("[data-note-id]");

      const noteId = noteElement?.dataset.noteId;

      if (!noteId) {
        return;
      }

      const note = notes.find((note) => note.id === noteId);

      if (note) {
        onClickNoteItem(note);
      }
    },
    [notes, onClickNoteItem],
  );

  const rowProps = useMemo(
    () => ({
      notes,
      handleNoteClick,
    }),
    [notes, handleNoteClick],
  );

  return (
    <List
      aria-label="Notes"
      className={styles.list}
      rowCount={notes.length}
      rowHeight={100}
      rowProps={rowProps}
      rowComponent={NoteRow}
      // The height comes from CSS; this is used until the list measures itself.
      defaultHeight={700}
    />
  );
});
