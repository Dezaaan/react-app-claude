// navigation/Navigation.tsx

import { useMemo } from "react";

import styles from "./Navigation.module.scss";

import { NavigationItem } from "./NavigationItem";
import { NavigationContext } from "./NavigationContext";
import { useNavigationItems } from "./useNavigationItems";

import type { NavigationProps } from "./types";

const NavigationRoot = ({ children }: NavigationProps) => {
  const items = useNavigationItems();

  return (
    <nav className={styles.navigation}>
      <ul>
        {items.map((item) => (
          <li key={item.path}>
            <NavigationItem to={item.path}>
              {item.meta.navigation?.label}
            </NavigationItem>
          </li>
        ))}

        {children}
      </ul>
    </nav>
  );
};

NavigationRoot.Item = NavigationItem;

export const Navigation = NavigationRoot;
