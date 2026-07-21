import { cn } from "@/shared/utils/cn";
import type { ComponentPropsWithoutRef } from "react";
import styles from "./Footer.module.scss";

type ModalFooterProps = ComponentPropsWithoutRef<"footer">;

export const ModalFooter = ({
  className,
  children,
  ...props
}: ModalFooterProps) => (
  <footer {...props} className={cn(styles.footer, className)}>
    {children}
  </footer>
);
