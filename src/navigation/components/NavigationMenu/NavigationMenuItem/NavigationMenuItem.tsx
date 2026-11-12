import { ListItem } from "@/shared/components/List";
import { NavigationItem } from "@/navigation/components/NavigationItem/NavigationItem";
import type { NavigationMenuItemProps } from "@/navigation/components/NavigationMenu/types";
import styles from "@/navigation/components/NavigationMenu/NavigationMenuItems/NavigationMenuItems.module.scss";

/** One menu entry: a link to a route, or a button that runs an action. */
export const NavigationMenuItem = ({
  item,
  onSelect,
}: NavigationMenuItemProps) => {
  return (
    <ListItem>
      {item.type === "link" ? (
        <NavigationItem
          className={styles.link}
          activeClassName={styles.active}
          to={item.to}
          onClick={onSelect}
        >
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
