import { can, type Permissions } from "@repo/auth/permissions";
import { createMiddleware } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";

import { authMiddleware, freshAuthMiddleware } from "./middleware";

/**
 * Middleware for role based access control(RBAC)
 *
 * @see https://tanstack.com/start/latest/docs/framework/react/guide/middleware
 */

export const requirePermission = (perms: Permissions, opts?: { fresh?: boolean }) =>
  createMiddleware()
    .middleware([opts?.fresh ? freshAuthMiddleware : authMiddleware])
    .server(async ({ next, context }) => {
      if (context.user.banned) {
        setResponseStatus(403);
        throw new Error("Account deactivated");
      }
      if (!can(context.user.role, perms)) {
        setResponseStatus(403);
        throw new Error("Forbidden");
      }
      return next();
    });
