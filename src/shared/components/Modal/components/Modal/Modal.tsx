import { createPortal } from "react-dom";
import {
  useId,
  useMemo,
  useRef,
  type JSX,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

import { cn } from "@/shared/utils/cn";
import { ModalContext } from "@/shared/components/Modal/context";
import { useBodyScrollLock } from "@/shared/components/Modal/hooks/useBodyScrollLock";
import { useFocusTrap } from "@/shared/components/Modal/hooks/useFocusTrap";
import type { ModalProps } from "@/shared/components/Modal/types";
import { ModalBody } from "@/shared/components/Modal/components/Body/Body";
import { ModalFooter } from "@/shared/components/Modal/components/Footer/Footer";
import { ModalHeader } from "@/shared/components/Modal/components/Header/Header";
import styles from "./Modal.module.scss";

type ModalComponent = {
  (props: ModalProps): JSX.Element | null;

  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
};

type ModalDialogProps = Omit<ModalProps, "open" | "container">;

// Separate component so focus handling and scroll lock run on open
// (mount) and are undone on close (unmount).
const ModalDialog = ({
  children,
  className,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  onClose,
  onKeyDown,
  ...props
}: ModalDialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const context = useMemo(() => ({ titleId }), [titleId]);

  const handleTab = useFocusTrap(dialogRef);
  useBodyScrollLock();

  const handleOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    // Clicking the backdrop would otherwise move focus out of the dialog.
    if (event.target === event.currentTarget) {
      event.preventDefault();
    }
  };

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (event.key === "Escape" && closeOnEscape) {
      // Only the innermost modal closes when modals are stacked.
      event.stopPropagation();
      onClose();
      return;
    }

    handleTab(event);
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={handleOverlayMouseDown}
      onClick={handleOverlayClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={props["aria-label"] ? undefined : titleId}
        tabIndex={-1}
        {...props}
        ref={dialogRef}
        className={cn(styles.modal, className)}
        onKeyDown={handleKeyDown}
      >
        <ModalContext.Provider value={context}>
          {children}
        </ModalContext.Provider>
      </div>
    </div>
  );
};

export const Modal: ModalComponent = ({
  open,
  container,
  ...props
}: ModalProps) => {
  if (!open) {
    return null;
  }

  return createPortal(<ModalDialog {...props} />, container ?? document.body);
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
