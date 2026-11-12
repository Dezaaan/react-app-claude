import { useContext } from "react";
import { AuthContext } from "@/features/auth/context/AuthContext";

/** The logged-in user and their permissions. Only usable inside AuthProvider. */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
