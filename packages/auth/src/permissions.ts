import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
  material: ["read", "manage"],
  class: ["read", "manage"],
  enrollment: ["manage"],
  academic: ["manage"],
  project: ["read", "participate", "create", "update", "delete"],
  submission: ["create", "read", "review", "grade"],
  rubric: ["manage"],
  discussion: ["participate", "moderate"],
  announcement: ["read", "create", "create-global"],
  audit: ["read"],
  system: ["configure", "security", "manage-roles"],
} as const;

export const ac = createAccessControl(statement);

const student = ac.newRole({
  material: ["read"],
  class: ["read"],
  project: ["read", "participate"],
  submission: ["create", "read"],
  discussion: ["participate"],
  announcement: ["read"],
});

const teacher = ac.newRole({
  material: ["read", "manage"],
  class: ["read", "manage"],
  enrollment: ["manage"],
  project: ["read", "participate", "create", "update", "delete"],
  submission: ["read", "review", "grade"],
  rubric: ["manage"],
  discussion: ["participate", "moderate"],
  announcement: ["read", "create"],
});

const admin = ac.newRole({
  ...adminAc.statements,
  material: ["read", "manage"],
  class: ["read", "manage"],
  enrollment: ["manage"],
  academic: ["manage"],
  discussion: ["moderate"],
  announcement: ["read", "create"],
  audit: ["read"],
});

const master = ac.newRole({
  ...adminAc.statements,
  material: ["read", "manage"],
  class: ["read", "manage"],
  enrollment: ["manage"],
  academic: ["manage"],
  discussion: ["moderate"],
  announcement: ["read", "create", "create-global"],
  audit: ["read"],
  system: ["configure", "security", "manage-roles"],
});

export const roles = { student, teacher, admin, master };
export type RoleName = keyof typeof roles;
export type Permissions = {
  [K in keyof typeof statement]?: (typeof statement)[K][number][];
};

export const roleHome: Record<RoleName, string> = {
  student: "/student",
  teacher: "/teacher",
  admin: "/admin",
  master: "/master",
};

export function can(role: string | null | undefined, perms: Permissions) {
  return (role ?? "").split(",").some((r) => {
    const def = roles[r.trim() as RoleName];
    return !!def && def.authorize(perms as never).success;
  });
}
