import { NavLink } from "react-router-dom";

import styles from "./NavigationMenuItem.module.scss";
import type { NavigationMenuItemProps } from "../types";

export const NavigationMenuItem = ({ item }: NavigationMenuItemProps) => {
  if (item.type === "link") {
    return (
      <li className={styles.item}>
        <NavLink className={styles.link} to={item.to}>
          {item.label}
        </NavLink>
      </li>
    );
  }

  return (
    <li className={styles.item}>
      <button className={styles.button} onClick={item.onClick} type="button">
        {item.label}
      </button>
    </li>
  );
};
