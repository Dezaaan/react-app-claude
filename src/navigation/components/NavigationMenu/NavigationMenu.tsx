import styles from "./NavigationMenu.module.scss";
import { NavigationMenuItems } from "./NavigationMenuItems/NavigationMenuItems";
import { cn } from "@/shared/utils/cn";
import { useCallback, useId, useRef, useState } from "react";
import { useClickOutside } from "@/navigation/hooks/useClickOutside";

export const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  useClickOutside(menuRef, closeMenu, isOpen);

  return (
    <div className={styles.container} ref={menuRef}>
      <button
        type="button"
        className={cn(styles.trigger, isOpen && styles.open)}
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        ☰
      </button>

      {isOpen && <NavigationMenuItems id={menuId} onItemClick={closeMenu} />}
    </div>
  );
};
