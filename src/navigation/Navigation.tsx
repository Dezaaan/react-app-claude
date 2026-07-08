// navigation/Navigation.tsx

import styles from "./Navigation.module.scss";

import { NavigationItem } from "./NavigationItem";
import { useNavigationItems } from "./useNavigationItems";

import { List } from "@/shared/components/List/List";
import { ListItem } from "@/shared/components/List/ListItem";

const NavigationRoot = () => {
  const items = useNavigationItems();

  return (
    <nav className={styles.navigation}>
      <List variant="grid">
        {items.map((item) => (
          <ListItem key={item.path}>
            <NavigationItem to={item.path}>
              {item.meta.navigation?.label}
            </NavigationItem>
          </ListItem>
        ))}
      </List>
    </nav>
  );
};

NavigationRoot.Item = NavigationItem;

export const Navigation = NavigationRoot;
