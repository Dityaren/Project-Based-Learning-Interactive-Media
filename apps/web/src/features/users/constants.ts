export const ROLES = ["student", "teacher", "admin", "master"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  student: "Student",
  teacher: "Teacher",
  admin: "Admin",
  master: "Master",
};

export const MANAGEABLE: Record<string, readonly Role[]> = {
  master: ROLES,
  admin: ["student", "teacher"],
};
