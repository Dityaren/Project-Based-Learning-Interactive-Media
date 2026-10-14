import type { listSubjects } from "./subjects.functions";

export type SubjectRow = Awaited<ReturnType<typeof listSubjects>>[number];
export const SUBJECTS_KEY = ["admin", "subjects"] as const;
