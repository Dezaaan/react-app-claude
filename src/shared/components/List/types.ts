import type { ComponentPropsWithoutRef } from "react";

export type ListProps = ComponentPropsWithoutRef<"ul"> & {
  variant?: "default" | "row" | "grid";
};

export type ListItemProps = ComponentPropsWithoutRef<"li">;
