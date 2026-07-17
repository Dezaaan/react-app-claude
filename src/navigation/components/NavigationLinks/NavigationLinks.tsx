import { List, ListItem } from "@/shared/components/List";
import { NavigationItem } from "../NavigationItem/NavigationItem";
import { useNavigationItems } from "@/navigation/hooks/useNavigationItems";
import styles from "./NavigationLinks.module.scss";

export const NavigationLinks = () => {
  const navigationItems = useNavigationItems("nav");
  return (
    <List className={styles.navLinks}>
      {navigationItems.map((navItem) => (
        <ListItem key={navItem.path}>
          <NavigationItem to={navItem.path}>
            {navItem.meta.navigation?.label}
          </NavigationItem>
        </ListItem>
      ))}
    </List>
  );
};
