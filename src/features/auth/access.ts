import type { AccessRequirement, Permission } from "./types";

/**
 * Whether someone with `permissions` meets `access`. No requirement means
 * any logged-in user may access it.
 *
 * This only decides what the UI shows. The backend must enforce the same
 * rules, because anything in the browser can be bypassed.
 */
export const canAccess = (
  permissions: readonly Permission[],
  access?: AccessRequirement,
): boolean => {
  if (!access) {
    return true;
  }

  switch (access.type) {
    case "permission":
      return permissions.includes(access.permission);
  }
};
