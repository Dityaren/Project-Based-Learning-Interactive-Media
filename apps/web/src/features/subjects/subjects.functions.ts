import { requirePermission } from "@repo/auth/tanstack/middleware";
import { createServerFn } from "@tanstack/react-start";

import { idSchema, subjectSchema, updateSubjectSchema } from "./schemas";

const server = () => import("./subjects.server");

export const listSubjects = createServerFn({ method: "GET" })
  .middleware([requirePermission({ academic: ["manage"] })])
  .handler(async () => (await server()).querySubjects());

export const createSubject = createServerFn({ method: "POST" })
  .middleware([requirePermission({ academic: ["manage"] }, { fresh: true })])
  .validator(subjectSchema)
  .handler(async ({ data, context }) => (await server()).createSubject(context.user, data));

export const updateSubject = createServerFn({ method: "POST" })
  .middleware([requirePermission({ academic: ["manage"] }, { fresh: true })])
  .validator(updateSubjectSchema)
  .handler(async ({ data, context }) => (await server()).updateSubject(context.user, data));

export const deleteSubject = createServerFn({ method: "POST" })
  .middleware([requirePermission({ academic: ["manage"] }, { fresh: true })])
  .validator(idSchema)
  .handler(async ({ data, context }) => (await server()).removeSubject(context.user, data.id));
