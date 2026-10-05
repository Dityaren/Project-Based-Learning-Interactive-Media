import { StatusBadge, type Tone } from "#/components/status-badge";

import { ROLE_LABEL, type Role } from "../constants";

const TONE: Record<Role, Tone> = {
  student: "neutral",
  teacher: "success",
  admin: "info",
  master: "violet",
};

export function RoleBadge({ role }: { role?: string | null }) {
  const r = (role ?? "student") as Role;
  return <StatusBadge tone={TONE[r] ?? "neutral"}>{ROLE_LABEL[r] ?? r}</StatusBadge>;
}
