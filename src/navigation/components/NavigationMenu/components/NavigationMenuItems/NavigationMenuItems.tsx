import styles from "./NavigationMenuItems.module.scss";
import { List } from "@/shared/components/List";
import { useNavigationItems } from "@/navigation/hooks/useNavigationItems";
import { NavigationItem } from "@/navigation";

export const NavigationMenuItems = () => {
  const menuItems = useNavigationItems("menu");
  return (
    <List className={styles.menuItems}>
      {menuItems.map((item) => (
        <NavigationItem className={styles.link} key={item.path} to={item.path}>
          {item.meta.navigation?.label}
        </NavigationItem>
      ))}
    </List>
  );
};
