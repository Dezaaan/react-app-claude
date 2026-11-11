import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * The dialog is named by its `Modal.Header`. Without a header, pass
 * `aria-label` so screen readers can still announce what the dialog is.
 */
export type ModalProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  container?: Element;
  onClose: () => void;
  open: boolean;
};
