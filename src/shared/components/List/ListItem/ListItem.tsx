import clsx from "clsx";

import styles from "./ListItem.module.scss";

import type { ListItemProps } from "../types";
import { forwardRef } from "react";

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ children, className, direction = "default", ...props }, ref) => {
    return (
      <li className={clsx(styles[direction], className)} {...props} ref={ref}>
        {children}
      </li>
    );
  },
);
