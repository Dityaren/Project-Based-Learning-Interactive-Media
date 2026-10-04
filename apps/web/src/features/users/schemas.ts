import { z } from "zod";

import { ROLES } from "./constants";

export const roleSchema = z.enum(ROLES);

export const listUsersSchema = z.object({
  q: z.string().max(100).optional(),
  role: roleSchema.optional(),
  status: z.enum(["active", "banned"]).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(50).default(10),
});

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  role: roleSchema,
});

export const setRoleSchema = z.object({ userId: z.string(), role: roleSchema });

export const setBanSchema = z.object({
  userId: z.string(),
  banned: z.boolean(),
  reason: z.string().max(200).optional(),
});

export const setPasswordSchema = z.object({
  userId: z.string(),
  password: z.string().min(8).max(128),
});

export type ListUsersInput = z.infer<typeof listUsersSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type SetRoleInput = z.infer<typeof setRoleSchema>;
export type SetBanInput = z.infer<typeof setBanSchema>;
export type SetPasswordInput = z.infer<typeof setPasswordSchema>;
