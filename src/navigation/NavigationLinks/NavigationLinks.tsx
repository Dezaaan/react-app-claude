import { ListItem } from "@/shared/components/List";
import { useNavigationItems } from "../hooks/useNavigationItems";
import { NavigationItem } from "../NavigationItem/NavigationItem";

export const NavigationLinks = () => {
  const navigationItems = useNavigationItems();

  return (
    <>
      {navigationItems.map((navItem) => (
        <ListItem key={navItem.path} variant="default">
          <NavigationItem to={navItem.path}>
            {navItem.meta.navigation?.label}
          </NavigationItem>
        </ListItem>
      ))}
    </>
  );
};
