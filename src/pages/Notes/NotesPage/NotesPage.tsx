import { List, ListItem } from "@/shared/components/List";
import { NoteItem } from "../NoteItem/NoteItem";

import styles from "./NotesPage.module.scss";
import { useModal } from "@/shared/components/Modal";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { useState } from "react";

const notes = [
  {
    id: 1,
    title: "Shopping",
    description: "Buy groceries and household items.",
  },
  {
    id: 2,
    title: "Workout",
    description:
      "Complete the gym routine for today. Complete the gym routine for today. Complete the gym routine for today.",
  },
  {
    id: 3,
    title: "Meeting",
    description: "Discuss project progress with the team.",
  },
];

type Note = {
  id: number;
  title: string;
  description: string;
};

const NotesPage = () => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleNoteClick = (note: Note) => {
    setSelectedNote({ ...note });
    openModal();
  };

  return (
    <div className={styles.container}>
      <h1>Notes</h1>

      <List className={styles.noteList}>
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
      <ConfirmationModal
        body={selectedNote?.description || ""}
        isOpen={isModalOpen}
        onCancel={closeModal}
        onConfirm={() => {}}
        title="Note Description"
      />
    </div>
  );
};

export default NotesPage;
