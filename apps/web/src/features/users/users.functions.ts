import { requirePermission } from "@repo/auth/tanstack/middleware";
import { createServerFn } from "@tanstack/react-start";

import {
  createUserSchema,
  listUsersSchema,
  setBanSchema,
  setPasswordSchema,
  setRoleSchema,
} from "./schemas";

const server = () => import("./users.server");

export const listUsers = createServerFn({ method: "GET" })
  .middleware([requirePermission({ user: ["list"] })])
  .validator(listUsersSchema)
  .handler(async ({ data }) => (await server()).queryUsers(data));

export const createUser = createServerFn({ method: "POST" })
  .middleware([requirePermission({ user: ["create"] }, { fresh: true })])
  .validator(createUserSchema)
  .handler(async ({ data, context }) => (await server()).createUserAccount(context.user, data));

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requirePermission({ user: ["set-role"] }, { fresh: true })])
  .validator(setRoleSchema)
  .handler(async ({ data, context }) => (await server()).changeUserRole(context.user, data));

export const setUserBan = createServerFn({ method: "POST" })
  .middleware([requirePermission({ user: ["ban"] }, { fresh: true })])
  .validator(setBanSchema)
  .handler(async ({ data, context }) => (await server()).changeUserBan(context.user, data));

export const setUserPassword = createServerFn({ method: "POST" })
  .middleware([requirePermission({ user: ["set-password"] }, { fresh: true })])
  .validator(setPasswordSchema)
  .handler(async ({ data, context }) => (await server()).changeUserPassword(context.user, data));
