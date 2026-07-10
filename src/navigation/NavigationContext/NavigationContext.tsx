// navigation/NavigationContext.ts

import { createContext } from "react";

interface NavigationContextValue {
  active: boolean;
}

export const NavigationContext = createContext<NavigationContextValue | null>(
  null,
);
