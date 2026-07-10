import { ListItem } from "@/shared/components/List";
import { useCallback, useRef, useState } from "react";
import { NavigationMenuItems } from "../NavigationMenuItems/NavigationMenuItems";
import styles from "./NavigationMenu.module.scss";
import { useClickOutside } from "@/navigation/hooks/useClickOutside";

export const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLLIElement>(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  useClickOutside(menuRef, closeMenu, isOpen);

  return (
    <ListItem className={styles.item} ref={menuRef}>
      <button type="button" onClick={() => setIsOpen((prev) => !prev)}>
        ☰
      </button>

      {isOpen && <NavigationMenuItems />}
    </ListItem>
  );
};
