import clsx from "clsx";

import styles from "./List.module.scss";

import type { ListProps } from "../types";

export const List = ({
  children,
  className,
  layout = "default",
  ...props
}: ListProps) => {
  return (
    <ul className={clsx(styles.list, styles[layout], className)} {...props}>
      {children}
    </ul>
  );
};
