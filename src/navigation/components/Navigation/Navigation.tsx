// navigation/Navigation.tsx

import styles from "./Navigation.module.scss";
import type { NavigationProps } from "@/navigation/types";
import { NavigationItem } from "@/navigation/components/NavigationItem/NavigationItem";
import { NavigationLinks } from "@/navigation/components/NavigationLinks/NavigationLinks";
import { NavigationMenu } from "@/navigation/components/NavigationMenu/NavigationMenu";

export const Navigation = ({ children }: NavigationProps) => {
  return <nav className={styles.navigation}>{children}</nav>;
};

Navigation.Item = NavigationItem;
Navigation.Links = NavigationLinks;
Navigation.Menu = NavigationMenu;
