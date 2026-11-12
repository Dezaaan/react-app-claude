import type { Note, NotesFeatureProps } from "@/features/notes/types";
import { NoteDetailsModal } from "@/features/notes/components/NoteDetailsModal/NoteDetailsModal";
import { NotesList } from "@/features/notes/components/NotesList/NotesList";
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
