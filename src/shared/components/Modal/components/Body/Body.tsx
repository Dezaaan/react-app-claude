import { cn } from "@/shared/utils/cn";
import type { ComponentPropsWithoutRef } from "react";
import styles from "./Body.module.scss";

type ModalBodyProps = ComponentPropsWithoutRef<"div">;

export const ModalBody = ({
  className,
  children,
  ...props
}: ModalBodyProps) => (
  <div {...props} className={cn(styles.body, className)}>
    {children}
  </div>
);
