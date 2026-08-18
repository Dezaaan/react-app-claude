import clsx from "clsx";

import styles from "./ListItem.module.scss";
import type { ListItemProps } from "../types";
import { forwardRef } from "react";

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <li ref={ref} className={clsx(styles.item, className)} {...props}>
        {children}
      </li>
    );
  },
);
