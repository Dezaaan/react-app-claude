import clsx from "clsx";

import styles from "./List.module.scss";
import type { ListProps } from "../types";

export const List = ({
  children,
  className,
  variant = "default",
}: ListProps) => {
  return (
    <ul className={clsx(styles.list, styles[variant], className)}>
      {children}
    </ul>
  );
};
