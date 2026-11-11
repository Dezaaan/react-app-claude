import type { Note, NotesFeatureProps } from "../../types";
import { NoteDetailsModal } from "../NoteDetailsModal/NoteDetailsModal";
import { NotesList } from "../NotesList/NotesList";
import { useCallback, useState } from "react";

export const NotesFeature = ({ notes }: NotesFeatureProps) => {
  // The selected note doubles as the modal's open state.
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleClose = useCallback(() => {
    setSelectedNote(null);
  }, []);

  return (
    <>
      <NotesList notes={notes} onClickNoteItem={setSelectedNote} />
      <NoteDetailsModal note={selectedNote} onClose={handleClose} />
    </>
  );
};
