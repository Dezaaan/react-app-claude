import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type ModalProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
  closeOnOverlayClick?: boolean;
  container?: Element;
  onClose: () => void;
  open: boolean;
};
