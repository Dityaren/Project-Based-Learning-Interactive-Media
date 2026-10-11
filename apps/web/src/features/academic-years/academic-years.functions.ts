import { requirePermission } from "@repo/auth/tanstack/middleware";
import { createServerFn } from "@tanstack/react-start";

import { academicYearSchema, idSchema, updateAcademicYearSchema } from "./schemas";

const server = () => import("./academic-years.server");

export const listAcademicYears = createServerFn({ method: "GET" })
  .middleware([requirePermission({ academic: ["manage"] })])
  .handler(async () => (await server()).queryAcademicYears());

export const createAcademicYear = createServerFn({ method: "POST" })
  .middleware([requirePermission({ academic: ["manage"] }, { fresh: true })])
  .validator(academicYearSchema)
  .handler(async ({ data, context }) => (await server()).createYear(context.user, data));

export const updateAcademicYear = createServerFn({ method: "POST" })
  .middleware([requirePermission({ academic: ["manage"] }, { fresh: true })])
  .validator(updateAcademicYearSchema)
  .handler(async ({ data, context }) => (await server()).updateYear(context.user, data));

export const activateAcademicYear = createServerFn({ method: "POST" })
  .middleware([requirePermission({ academic: ["manage"] }, { fresh: true })])
  .validator(idSchema)
  .handler(async ({ data, context }) => (await server()).activateYear(context.user, data.id));

export const deleteAcademicYear = createServerFn({ method: "POST" })
  .middleware([requirePermission({ academic: ["manage"] }, { fresh: true })])
  .validator(idSchema)
  .handler(async ({ data, context }) => (await server()).removeYear(context.user, data.id));
