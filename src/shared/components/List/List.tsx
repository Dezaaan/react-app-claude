import clsx from "clsx";

import styles from "./List.module.scss";

import type { ListProps } from "./types";

export const List = ({
  children,
  className,
  orientation = "column",
  variant = "default",
  ...props
}: ListProps) => {
  return (
    <ul
      className={clsx(
        styles.list,
        styles[orientation],
        styles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
};
