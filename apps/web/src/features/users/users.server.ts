import "@tanstack/react-start/server-only";
import { auth } from "@repo/auth/auth";
import { db } from "@repo/db";
import { logAudit } from "@repo/db/audit";
import { user } from "@repo/db/schema";
import { getRequestHeaders, setResponseStatus } from "@tanstack/react-start/server";
import { and, count, desc, eq, ilike, isNull, or } from "drizzle-orm";

import { fail } from "#/lib/http.server";

import { MANAGEABLE, type Role } from "./constants";
import type {
  CreateUserInput,
  ListUsersInput,
  SetBanInput,
  SetPasswordInput,
  SetRoleInput,
} from "./schemas";

type Actor = { id: string; role?: string | null };

const allowedFor = (role?: string | null): readonly Role[] => MANAGEABLE[role ?? ""] ?? [];

async function loadTarget(actor: Actor, targetId: string, newRole?: Role) {
  if (actor.id === targetId) fail(400, "You can't change your own account from here");

  const [target] = await db
    .select({ id: user.id, role: user.role, email: user.email })
    .from(user)
    .where(eq(user.id, targetId))
    .limit(1);
  if (!target) fail(404, "User not found");

  const allowed = allowedFor(actor.role);
  if (!allowed.includes((target.role ?? "student") as Role))
    fail(403, "You can't manage this account");
  if (newRole && !allowed.includes(newRole)) fail(403, "You can't assign that role");
  return target;
}

export async function queryUsers(input: ListUsersInput) {
  const like = input.q ? `%${input.q.replace(/[\\%_]/g, "\\$&")}%` : null;
  const where = and(
    like ? or(ilike(user.name, like), ilike(user.email, like)) : undefined,
    input.role ? eq(user.role, input.role) : undefined,
    input.status === "banned" ? eq(user.banned, true) : undefined,
    input.status === "active" ? or(eq(user.banned, false), isNull(user.banned)) : undefined,
  );

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        banned: user.banned,
        banReason: user.banReason,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(where)
      .orderBy(desc(user.createdAt))
      .limit(input.pageSize)
      .offset((input.page - 1) * input.pageSize),
    db.select({ total: count() }).from(user).where(where),
  ]);

  return { rows, total, page: input.page, pageSize: input.pageSize };
}

export async function createUserAccount(actor: Actor, input: CreateUserInput) {
  if (!allowedFor(actor.role).includes(input.role)) fail(403, "You can't assign that role");

  const res = await auth.api.createUser({ body: input as never, headers: getRequestHeaders() });
  await logAudit({
    actorId: actor.id,
    action: "user.create",
    entityType: "user",
    entityId: res.user.id,
    metadata: { email: input.email, role: input.role },
  });
  return { id: res.user.id };
}

export async function changeUserRole(actor: Actor, input: SetRoleInput) {
  const target = await loadTarget(actor, input.userId, input.role);
  await auth.api.setRole({
    body: { userId: input.userId, role: input.role } as never,
    headers: getRequestHeaders(),
  });
  await logAudit({
    actorId: actor.id,
    action: "user.set-role",
    entityType: "user",
    entityId: input.userId,
    metadata: { email: target.email, from: target.role, to: input.role },
  });
}

export async function changeUserBan(actor: Actor, input: SetBanInput) {
  const target = await loadTarget(actor, input.userId);
  const headers = getRequestHeaders();

  if (input.banned) {
    await auth.api.banUser({
      body: { userId: input.userId, banReason: input.reason || undefined },
      headers,
    });
  } else {
    await auth.api.unbanUser({ body: { userId: input.userId }, headers });
  }

  await logAudit({
    actorId: actor.id,
    action: input.banned ? "user.deactivate" : "user.reactivate",
    entityType: "user",
    entityId: input.userId,
    metadata: { email: target.email, reason: input.reason },
  });
}

export async function changeUserPassword(actor: Actor, input: SetPasswordInput) {
  const target = await loadTarget(actor, input.userId);
  await auth.api.setUserPassword({
    body: { userId: input.userId, newPassword: input.password },
    headers: getRequestHeaders(),
  });
  await logAudit({
    actorId: actor.id,
    action: "user.reset-password",
    entityType: "user",
    entityId: input.userId,
    metadata: { email: target.email },
  });
}
