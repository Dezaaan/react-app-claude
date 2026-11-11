import { useSubmit } from "react-router-dom";

import styles from "./NavigationMenuItems.module.scss";
import { ROUTES } from "@/app/router/routes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNavigationItems } from "@/navigation/hooks/useNavigationItems";
import { List } from "@/shared/components/List";
import { NavigationMenuItem } from "../NavigationMenuItem/NavigationMenuItem";
import type { NavigationMenuItemConfig } from "../types";

type NavigationMenuItemsProps = {
  id?: string;
  onItemClick?: () => void;
};

export const NavigationMenuItems = ({
  id,
  onItemClick,
}: NavigationMenuItemsProps) => {
  const { user } = useAuth();
  const routes = useNavigationItems("menu");
  const submit = useSubmit();

  const items: NavigationMenuItemConfig[] = [
    ...routes.map((route) => ({
      id: route.path,
      label: route.meta.navigation?.label ?? route.meta.title,
      type: "link" as const,
      to: route.path,
    })),
    {
      id: "logout",
      label: "Log out",
      type: "action",
      // POST to the logout route's action, like submitting a form.
      onClick: () => submit(null, { method: "post", action: ROUTES.LOGOUT }),
    },
  ];

  return (
    <div id={id} className={styles.menuItems}>
      <p className={styles.user}>{user.email}</p>
      <List>
        {items.map((item) => (
          <NavigationMenuItem
            key={item.id}
            item={item}
            onSelect={onItemClick}
          />
        ))}
      </List>
    </div>
  );
};
