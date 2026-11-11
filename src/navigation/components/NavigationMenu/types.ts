export type NavigationMenuItemConfig =
  | {
      id: string;
      label: string;
      type: "link";
      to: string;
    }
  | {
      id: string;
      label: string;
      type: "action";
      onClick: () => void;
    };

export type NavigationMenuItemProps = {
  item: NavigationMenuItemConfig;
  /** Called when the item is chosen, e.g. to close the menu. */
  onSelect?: () => void;
};
