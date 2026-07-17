import styles from "./NavigationMenuItems.module.scss";
import { NavigationMenuItem } from "../NavigationMenuItem/NavigationMenuItem";
import { menuItems } from "../../menu-items";
import { List } from "@/shared/components/List";

export const NavigationMenuItems = () => {
  return (
    <List className={styles.menuItems}>
      {menuItems.map((item) => (
        <NavigationMenuItem item={item} key={item.id} />
      ))}
    </List>
  );
};
