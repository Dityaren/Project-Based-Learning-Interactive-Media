import type { Role } from "./constants";
import type { listUsers } from "./users.functions";

export type UserRow = Awaited<ReturnType<typeof listUsers>>["rows"][number];
export type UsersSearch = { q?: string; role?: Role; status?: "active" | "banned"; page?: number };
