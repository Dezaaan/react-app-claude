import clsx from "clsx";

import styles from "./ListItem.module.scss";
import type { ListItemProps } from "../types";

export const ListItem = ({ children, className, onClick }: ListItemProps) => {
  return (
    <li className={clsx(styles.item, className)} onClick={onClick}>
      {children}
    </li>
  );
};
