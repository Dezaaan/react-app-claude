// navigation/NavigationItem.tsx

import { NavLink } from "react-router-dom";

import type { NavigationItemProps } from "./types";
import styles from "./NavigationItem.module.scss";

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
        [styles.link, className, isActive ? styles.active : ""]
          .filter(Boolean)
          .join(" ")
      }
    >
      {children}
    </NavLink>
  );
};
