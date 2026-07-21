import { useState } from "react";

export const useModal = () => {
  const [open, setOpen] = useState(false);

  return {
    isModalOpen: open,
    openModal: () => setOpen(true),
    closeModal: () => setOpen(false),
  };
};
