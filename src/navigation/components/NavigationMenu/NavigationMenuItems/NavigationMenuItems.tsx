import styles from "./NavigationMenuItems.module.scss";
import { List, ListItem } from "@/shared/components/List";
import { useNavigationItems } from "@/navigation/hooks/useNavigationItems";
import { NavigationItem } from "../../NavigationItem/NavigationItem";

type NavigationMenuItemsProps = {
  id?: string;
  onItemClick?: () => void;
};

export const NavigationMenuItems = ({
  id,
  onItemClick,
}: NavigationMenuItemsProps) => {
  const menuItems = useNavigationItems("menu");
  return (
    <List id={id} className={styles.menuItems}>
      {menuItems.map((item) => (
        <ListItem key={item.path}>
          <NavigationItem
            className={styles.link}
            to={item.path}
            onClick={onItemClick}
          >
            {item.meta.navigation?.label}
          </NavigationItem>
        </ListItem>
      ))}
    </List>
  );
};
