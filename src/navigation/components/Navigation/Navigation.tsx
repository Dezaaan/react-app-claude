// navigation/Navigation.tsx

import styles from "./Navigation.module.scss";
import type { NavigationProps } from "@/navigation/types";
import { NavigationItem } from "../NavigationItem/NavigationItem";
import { NavigationLinks } from "../NavigationLinks/NavigationLinks";
import { NavigationMenu } from "../NavigationMenu/NavigationMenu";

export const Navigation = ({ children }: NavigationProps) => {
  return <nav className={styles.navigation}>{children}</nav>;
};

Navigation.Item = NavigationItem;
Navigation.Links = NavigationLinks;
Navigation.Menu = NavigationMenu;
