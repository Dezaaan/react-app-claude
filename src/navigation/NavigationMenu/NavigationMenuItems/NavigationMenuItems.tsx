import styles from "./NavigationMenuItems.module.scss";
import { menuItems } from "../menu-items";
import { NavigationMenuItem } from "../NavigationMenuItem/NavigationMenuItem";

export const NavigationMenuItems = () => {
  return (
    <ul className={styles.menuItems}>
      {menuItems.map((item) => (
        <NavigationMenuItem item={item} key={item.id} />
      ))}
    </ul>
  );
};
