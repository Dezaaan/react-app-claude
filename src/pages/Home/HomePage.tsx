import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { useModal } from "@/shared/components/Modal";

const HomePage = () => {
  const { isModalOpen, openModal, closeModal } = useModal();

  return (
    <div>
      <h1>Home</h1>

      <p>Welcome to the Notes application.</p>

      <button onClick={openModal}>Open modal</button>

      <ConfirmationModal
        body="Are you sure you want to delete this note?"
        isOpen={isModalOpen}
        onCancel={closeModal}
        onConfirm={() => {}}
        title="Delete note"
      />
    </div>
  );
};

export default HomePage;
