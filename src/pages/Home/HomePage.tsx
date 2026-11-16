import { PageHeader } from "@/layouts/PageHeader/PageHeader";
import { NotesFeature } from "@/features/notes/components/NotesFeature/NotesFeature";
import type { notesLoader } from "@/features/notes/loaders/notesLoader";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { useModal } from "@/shared/components/Modal";
import { useLoaderData } from "react-router-dom";

const HomePage = () => {
  const { isModalOpen, closeModal } = useModal();
  const { notes } = useLoaderData<typeof notesLoader>();

  return (
    <div>
      <PageHeader />

      <ConfirmationModal
        body="Are you sure you want to delete this note?"
        isOpen={isModalOpen}
        onCancel={closeModal}
        onConfirm={() => {}}
        title="Delete note"
      />
      <NotesFeature notes={notes} />
    </div>
  );
};

export default HomePage;
