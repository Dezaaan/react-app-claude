import type { Note } from "../../types";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { NotesList } from "../NotesList/NotesList";
import { useModal } from "@/shared/components/Modal";
import { useNotes } from "../../hooks/useNotes";
import { useState } from "react";

export const NotesFeature = () => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { isModalOpen, openModal, closeModal } = useModal();
  const { notes, isLoading, error } = useNotes();

  const handleNoteClick = (note: Note) => {
    setSelectedNote({ ...note });
    openModal();
  };

  if (isLoading) {
    return <p>Loading notes...</p>;
  }

  if (error) {
    return <p>Failed to load notes.</p>;
  }

  return (
    <>
      <NotesList notes={notes} handleNoteClick={handleNoteClick} />
      <ConfirmationModal
        body={selectedNote?.content || ""}
        isOpen={isModalOpen}
        onCancel={closeModal}
        onConfirm={() => {}}
        title="Note Description"
      />
    </>
  );
};
