import "@tanstack/react-start/server-only";
import { db } from "@repo/db";
import { logAudit } from "@repo/db/audit";
import { subject, teachingAssignment } from "@repo/db/schema";
import { asc, eq, sql } from "drizzle-orm";

import { fail } from "#/lib/http.server";

import type { SubjectInput, UpdateSubjectInput } from "./schemas";

type Actor = { id: string };

export function querySubjects() {
  return db
    .select({
      id: subject.id,
      code: subject.code,
      name: subject.name,
      assignmentCount: sql<number>`(select count(*)::int from ${teachingAssignment} where ${teachingAssignment.subjectId} = ${subject.id})`,
    })
    .from(subject)
    .orderBy(asc(subject.code));
}

async function getSubject(id: string) {
  const [row] = await db.select().from(subject).where(eq(subject.id, id)).limit(1);
  if (!row) fail(404, "Subject not found");
  return row;
}

async function assertCodeFree(code: string, exceptId?: string) {
  const [dupe] = await db
    .select({ id: subject.id })
    .from(subject)
    .where(eq(subject.code, code))
    .limit(1);
  if (dupe && dupe.id !== exceptId) fail(409, `A subject with code "${code}" already exists`);
}

export async function createSubject(actor: Actor, input: SubjectInput) {
  await assertCodeFree(input.code);
  const [row] = await db.insert(subject).values(input).returning({ id: subject.id });
  await logAudit({
    actorId: actor.id,
    action: "subject.create",
    entityType: "subject",
    entityId: row.id,
    metadata: input,
  });
  return row;
}

export async function updateSubject(actor: Actor, { id, ...input }: UpdateSubjectInput) {
  const before = await getSubject(id);
  await assertCodeFree(input.code, id);
  await db.update(subject).set(input).where(eq(subject.id, id));
  await logAudit({
    actorId: actor.id,
    action: "subject.update",
    entityType: "subject",
    entityId: id,
    metadata: { from: { code: before.code, name: before.name }, to: input },
  });
}

export async function removeSubject(actor: Actor, id: string) {
  const row = await getSubject(id);
  const used = await db.$count(teachingAssignment, eq(teachingAssignment.subjectId, id));
  if (used > 0)
    fail(409, `This subject is assigned to ${used} teaching ${used === 1 ? "slot" : "slots"}`);
  await db.delete(subject).where(eq(subject.id, id));
  await logAudit({
    actorId: actor.id,
    action: "subject.delete",
    entityType: "subject",
    entityId: id,
    metadata: { code: row.code, name: row.name },
  });
}
