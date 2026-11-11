import styles from "./NavigationMenu.module.scss";
import { NavigationMenuItems } from "./NavigationMenuItems/NavigationMenuItems";
import { cn } from "@/shared/utils/cn";
import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useClickOutside } from "@/navigation/hooks/useClickOutside";

export const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  useClickOutside(menuRef, closeMenu, isOpen);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && isOpen) {
      closeMenu();
      // Focus may be on a menu item that is about to disappear.
      triggerRef.current?.focus();
    }
  };

  return (
    <div className={styles.container} ref={menuRef} onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
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
