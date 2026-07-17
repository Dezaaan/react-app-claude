import styles from "./NavigationMenuItems.module.scss";
import { NavigationMenuItem } from "../NavigationMenuItem/NavigationMenuItem";
import { menuItems } from "../../menu-items";

export const NavigationMenuItems = () => {
  return (
    <ul className={styles.menuItems}>
      {menuItems.map((item) => (
        <NavigationMenuItem item={item} key={item.id} />
      ))}
    </ul>
  );
};
