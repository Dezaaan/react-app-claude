import clsx from "clsx";

import styles from "./ListItem.module.scss";
import type { ListItemProps } from "../types";

export const ListItem = ({ children, className }: ListItemProps) => {
  return <li className={clsx(styles.item, className)}>{children}</li>;
};
