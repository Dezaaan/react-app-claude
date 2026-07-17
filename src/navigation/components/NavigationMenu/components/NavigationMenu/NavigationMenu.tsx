import styles from "./NavigationMenu.module.scss";
import { ListItem } from "@/shared/components/List";
import { NavigationMenuItems } from "../NavigationMenuItems/NavigationMenuItems";
import { cn } from "@/shared/utils/cn";
import { useCallback, useRef, useState } from "react";
import { useClickOutside } from "@/navigation/hooks/useClickOutside";

export const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLLIElement>(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  useClickOutside(menuRef, closeMenu, isOpen);

  return (
    <ListItem className={styles.container} ref={menuRef}>
      <button
        type="button"
        className={cn(styles.trigger, isOpen && styles.open)}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        ☰
      </button>

      {isOpen && <NavigationMenuItems />}
    </ListItem>
  );
};
