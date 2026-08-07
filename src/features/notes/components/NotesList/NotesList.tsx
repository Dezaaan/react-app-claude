import { List } from "@/shared/components/List/List/List";
import styles from "./NotesList.module.scss";
import { ListItem } from "@/shared/components/List/ListItem/ListItem";
import type { Note } from "../../types";
import { NoteItem } from "../NoteItem/NoteItem";
import { memo } from "react";

type NotesListProps = {
  notes: Note[];
  onClickNoteItem: (note: Note) => void;
};

export const NotesList = memo(({ notes, onClickNoteItem }: NotesListProps) => {
  const handleListClick = (event: React.MouseEvent<HTMLUListElement>) => {
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
  };

  return (
    <List className={styles.notesList} onClick={handleListClick}>
      {notes.map((note) => (
        <ListItem
          className={styles.noteItem}
          data-note-id={note.id}
          key={note.id}
        >
          <NoteItem note={note} />
        </ListItem>
      ))}
    </List>
  );
});
