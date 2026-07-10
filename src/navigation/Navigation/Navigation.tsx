// navigation/Navigation.tsx

import styles from "./Navigation.module.scss";
import type { NavigationProps } from "../types";
import { List } from "@/shared/components/List/List/List";
import { NavigationItem } from "../NavigationItem/NavigationItem";
import { NavigationLinks } from "../NavigationLinks/NavigationLinks";
import { NavigationMenu } from "../NavigationMenu/NavigationMenu/NavigationMenu";

export const Navigation = ({ children }: NavigationProps) => {
  return (
    <nav className={styles.navigation}>
      <List variant="grid">{children}</List>
    </nav>
  );
};

Navigation.Item = NavigationItem;
Navigation.Links = NavigationLinks;
Navigation.Menu = NavigationMenu;
