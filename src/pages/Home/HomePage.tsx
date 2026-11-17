import { PageHeader } from "@/layouts/PageHeader/PageHeader";
import { NotesFeature } from "@/features/notes/components/NotesFeature/NotesFeature";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { useModal } from "@/shared/components/Modal";

const HomePage = () => {
  const { isModalOpen, closeModal } = useModal();

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
      <NotesFeature />
    </div>
  );
};

export default HomePage;
