import { createContext, useContext } from "react";

type ModalContextValue = {
  /** Id of the modal's title, used to give the dialog its accessible name. */
  titleId: string;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

export const useModalContext = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("Modal.Header must be used inside a Modal.");
  }

  return context;
};
