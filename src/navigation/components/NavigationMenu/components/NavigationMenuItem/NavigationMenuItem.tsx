import styles from "./NavigationMenuItem.module.scss";
import type { NavigationMenuItemProps } from "../../types";
import { NavLink } from "react-router-dom";
import { cn } from "@/shared/utils/cn";

export const NavigationMenuItem = ({ item }: NavigationMenuItemProps) => {
  return (
    <li className={styles.item}>
      {item.type === "link" ? (
        <NavLink
          className={({ isActive }) =>
            cn(styles.link, isActive && styles.active)
          }
          to={item.to}
        >
          {item.label}
        </NavLink>
      ) : (
        <button className={styles.button} onClick={item.onClick} type="button">
          {item.label}
        </button>
      )}
    </li>
  );
};
