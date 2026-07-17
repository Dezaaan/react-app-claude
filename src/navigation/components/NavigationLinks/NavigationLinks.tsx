import { ListItem } from "@/shared/components/List";
import { NavigationItem } from "../NavigationItem/NavigationItem";
import { useNavigationItems } from "@/navigation/hooks/useNavigationItems";

export const NavigationLinks = () => {
  const navigationItems = useNavigationItems();

  return (
    <>
      {navigationItems.map((navItem) => (
        <ListItem key={navItem.path} direction="default">
          <NavigationItem to={navItem.path}>
            {navItem.meta.navigation?.label}
          </NavigationItem>
        </ListItem>
      ))}
    </>
  );
};
