import clsx from "clsx";

import styles from "./ListItem.module.scss";

import type { ListItemProps } from "../types";
import { forwardRef } from "react";

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ children, className, variant = "default", ...props }, ref) => {
    return (
      <li className={clsx(styles[variant], className)} {...props} ref={ref}>
        {children}
      </li>
    );
  },
);
