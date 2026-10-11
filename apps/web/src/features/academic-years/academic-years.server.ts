import "@tanstack/react-start/server-only";
import { db } from "@repo/db";
import { logAudit } from "@repo/db/audit";
import { academicYear, schoolClass } from "@repo/db/schema";
import { desc, eq, sql } from "drizzle-orm";

import { fail } from "#/lib/http.server";

import type { AcademicYearInput, UpdateAcademicYearInput } from "./schemas";

type Actor = { id: string };

export function queryAcademicYears() {
  return db
    .select({
      id: academicYear.id,
      name: academicYear.name,
      startDate: academicYear.startDate,
      endDate: academicYear.endDate,
      isActive: academicYear.isActive,
      classCount: sql<number>`(select count(*)::int from ${schoolClass} where ${schoolClass.academicYearId} = ${academicYear.id})`,
    })
    .from(academicYear)
    .orderBy(desc(academicYear.startDate));
}

async function assertNameFree(name: string, exceptId?: string) {
  const [dupe] = await db
    .select({ id: academicYear.id })
    .from(academicYear)
    .where(eq(academicYear.name, name))
    .limit(1);
  if (dupe && dupe.id !== exceptId) fail(409, `An academic year named "${name}" already exists`);
}

async function getYear(id: string) {
  const [row] = await db.select().from(academicYear).where(eq(academicYear.id, id)).limit(1);
  if (!row) fail(404, "Academic year not found");
  return row;
}

export async function createYear(actor: Actor, input: AcademicYearInput) {
  await assertNameFree(input.name);
  const [row] = await db.insert(academicYear).values(input).returning({ id: academicYear.id });
  await logAudit({
    actorId: actor.id,
    action: "academic-year.create",
    entityType: "academic_year",
    entityId: row.id,
    metadata: input,
  });
  return row;
}

export async function updateYear(actor: Actor, { id, ...input }: UpdateAcademicYearInput) {
  const before = await getYear(id);
  await assertNameFree(input.name, id);
  await db.update(academicYear).set(input).where(eq(academicYear.id, id));
  await logAudit({
    actorId: actor.id,
    action: "academic-year.update",
    entityType: "academic_year",
    entityId: id,
    metadata: {
      from: { name: before.name, startDate: before.startDate, endDate: before.endDate },
      to: input,
    },
  });
}

export async function activateYear(actor: Actor, id: string) {
  const year = await getYear(id);
  await db.transaction(async (tx) => {
    await tx.update(academicYear).set({ isActive: false }).where(eq(academicYear.isActive, true));
    await tx.update(academicYear).set({ isActive: true }).where(eq(academicYear.id, id));
  });
  await logAudit({
    actorId: actor.id,
    action: "academic-year.activate",
    entityType: "academic_year",
    entityId: id,
    metadata: { name: year.name },
  });
}

export async function removeYear(actor: Actor, id: string) {
  const year = await getYear(id);
  if (year.isActive) fail(409, "Set another year active before deleting this one");
  const classes = await db.$count(schoolClass, eq(schoolClass.academicYearId, id));
  if (classes > 0) fail(409, `This year still has ${classes} class${classes === 1 ? "" : "es"}`);
  await db.delete(academicYear).where(eq(academicYear.id, id));
  await logAudit({
    actorId: actor.id,
    action: "academic-year.delete",
    entityType: "academic_year",
    entityId: id,
    metadata: { name: year.name },
  });
}
