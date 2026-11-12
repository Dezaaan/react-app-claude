import clsx from "clsx";

import styles from "./List.module.scss";
import type { ListProps } from "@/shared/components/List/types";

export const List = ({
  children,
  className,
  variant = "default",
  ...props
}: ListProps) => {
  return (
    <ul className={clsx(styles.list, styles[variant], className)} {...props}>
      {children}
    </ul>
  );
};
