// navigation/NavigationItem.tsx

import { NavLink } from "react-router-dom";

import type { NavigationItemProps } from "./types";
import styles from "./NavigationItem.module.scss";

import { cn } from "@/shared/utils/cn";

export const NavigationItem = ({
  to,
  children,
  className,
}: NavigationItemProps) => {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        cn(styles.list, className, isActive && styles.active)
      }
    >
      {children}
    </NavLink>
  );
};
