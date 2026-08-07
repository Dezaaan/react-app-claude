import type { Note } from "../../types";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { NotesList } from "../NotesList/NotesList";
import { useModal } from "@/shared/components/Modal";
import { useNotes } from "../../hooks/useNotes";
import { useCallback, useState } from "react";

export const NotesFeature = () => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { isModalOpen, openModal, closeModal } = useModal();
  const { notes, isLoading, error } = useNotes();

  const handleNoteItemClick = useCallback(
    (note: Note) => {
      setSelectedNote(note);
      openModal();
    },
    [openModal],
  );

  const handleClose = useCallback(() => {
    setSelectedNote(null);
    closeModal();
  }, [closeModal]);

  if (isLoading) {
    return <p>Loading notes...</p>;
  }

  if (error) {
    return <p>Failed to load notes.</p>;
  }

  return (
    <>
      <NotesList notes={notes} onClickNoteItem={handleNoteItemClick} />
      <ConfirmationModal
        body={selectedNote?.content || ""}
        isOpen={isModalOpen}
        onCancel={handleClose}
        // onConfirm={() => {}}
        title="Note Description"
      />
    </>
  );
};
