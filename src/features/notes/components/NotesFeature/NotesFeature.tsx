import type { Note, NotesFeatureProps } from "../../types";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { NotesList } from "../NotesList/NotesList";
import { useModal } from "@/shared/components/Modal";
import { useCallback, useState } from "react";

export const NotesFeature = ({ notes }: NotesFeatureProps) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { isModalOpen, openModal, closeModal } = useModal();

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
