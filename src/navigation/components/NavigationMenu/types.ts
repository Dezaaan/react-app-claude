import type { ReactNode } from "react";

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
  children?: ReactNode;
};
