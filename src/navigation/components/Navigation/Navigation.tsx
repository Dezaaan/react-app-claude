// navigation/Navigation.tsx

import styles from "./Navigation.module.scss";
import type { NavigationProps } from "@/navigation/types";
import { List } from "@/shared/components/List/List/List";
import { NavigationItem } from "../NavigationItem/NavigationItem";
import { NavigationLinks } from "../NavigationLinks/NavigationLinks";
import { NavigationMenu } from "../NavigationMenu/components/NavigationMenu/NavigationMenu";

export const Navigation = ({ children }: NavigationProps) => {
  return (
    <nav className={styles.navigation}>
      <List layout="horizontal">{children}</List>
    </nav>
  );
};

Navigation.Item = NavigationItem;
Navigation.Links = NavigationLinks;
Navigation.Menu = NavigationMenu;
