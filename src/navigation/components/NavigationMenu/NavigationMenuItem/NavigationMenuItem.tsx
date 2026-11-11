import { ListItem } from "@/shared/components/List";
import { NavigationItem } from "../../NavigationItem/NavigationItem";
import type { NavigationMenuItemProps } from "../types";
import styles from "../NavigationMenuItems/NavigationMenuItems.module.scss";

/** One menu entry: a link to a route, or a button that runs an action. */
export const NavigationMenuItem = ({
  item,
  onSelect,
}: NavigationMenuItemProps) => {
  return (
    <ListItem>
      {item.type === "link" ? (
        <NavigationItem className={styles.link} to={item.to} onClick={onSelect}>
          {item.label}
        </NavigationItem>
      ) : (
        <button
          type="button"
          className={styles.button}
          onClick={() => {
            onSelect?.();
            item.onClick();
          }}
        >
          {item.label}
        </button>
      )}
    </ListItem>
  );
};
