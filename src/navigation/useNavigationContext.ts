// navigation/useNavigationContext.ts

import { useContext } from "react";

import { NavigationContext } from "./NavigationContext";

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error("Navigation components must be used inside Navigation");
  }

  return context;
};
