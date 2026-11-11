// navigation/NavigationItem.tsx

import { NavLink } from "react-router-dom";

import styles from "./NavigationItem.module.scss";

import { cn } from "@/shared/utils/cn";
import type { NavigationItemProps } from "@/navigation/types";

export const NavigationItem = ({
  to,
  children,
  className,
  onClick,
}: NavigationItemProps) => {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        cn(styles.list, className, isActive && styles.active)
      }
    >
      {children}
    </NavLink>
  );
};
