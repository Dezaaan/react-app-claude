import { List } from "@/shared/components/List/List/List";
import styles from "./NotesList.module.scss";
import { ListItem } from "@/shared/components/List/ListItem/ListItem";
import type { Note } from "../../types";
import { NoteItem } from "../NoteItem/NoteItem";

type NotesListProps = {
  notes: Note[];
  handleNoteClick: (note: Note) => void;
};

export const NotesList = ({ notes, handleNoteClick }: NotesListProps) => {
  return (
    <List className={styles.notesList}>
      {notes.map((note) => (
        <ListItem
          key={note.id}
          className={styles.noteItem}
          onClick={() => handleNoteClick(note)}
        >
          <NoteItem {...note} />
        </ListItem>
      ))}
    </List>
  );
};
