import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/utils/cn";
import { useModalContext } from "../../context";
import styles from "./Header.module.scss";

type ModalHeaderProps = ComponentPropsWithoutRef<"header">;

/** The modal's title. Its text is what screen readers announce on open. */
export const ModalHeader = ({
  className,
  children,
  ...props
}: ModalHeaderProps) => {
  const { titleId } = useModalContext();

  return (
    <header {...props} className={cn(styles.header, className)}>
      <h2 id={titleId} className={styles.title}>
        {children}
      </h2>
    </header>
  );
};
