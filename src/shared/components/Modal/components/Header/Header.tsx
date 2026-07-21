import type { ComponentPropsWithoutRef } from "react";

import styles from "./Header.module.scss";
import { cn } from "@/shared/utils/cn";

type ModalHeaderProps = ComponentPropsWithoutRef<"header">;

export const ModalHeader = ({
  className,
  children,
  ...props
}: ModalHeaderProps) => (
  <header {...props} className={cn(styles.header, className)}>
    {children}
  </header>
);
