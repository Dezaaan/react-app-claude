import clsx from "clsx";

import styles from "./ListItem.module.scss";

import type { ListItemProps } from "./types";

export const ListItem = ({
  children,
  className,
  variant = "default",
  ...props
}: ListItemProps) => {
  return (
    <li className={clsx(styles[variant], className)} {...props}>
      {children}
    </li>
  );
};
