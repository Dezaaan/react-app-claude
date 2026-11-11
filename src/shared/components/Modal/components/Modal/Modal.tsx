import { createPortal } from "react-dom";
import type { ModalProps } from "../../types";
import styles from "./Modal.module.scss";
import { cn } from "@/shared/utils/cn";
import { ModalFooter } from "../Footer/Footer";
import { ModalHeader } from "../Header/Header";
import { ModalBody } from "../Body/Body";
import type { JSX } from "react";

type ModalComponent = {
  (props: ModalProps): JSX.Element | null;

  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
};

export const Modal: ModalComponent = ({
  open,
  children,
  className,
  closeOnOverlayClick = true,
  container,
  onClose,
  ...props
}: ModalProps) => {
  if (!open) {
    return null;
  }

  const handleClose = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.overlay} onClick={handleClose}>
      <div {...props} className={cn(styles.modal, className)}>
        {children}
      </div>
    </div>,
    container ?? document.body,
  );
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
