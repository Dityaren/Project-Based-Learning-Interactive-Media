import type { listAcademicYears } from "./academic-years.functions";

export type AcademicYearRow = Awaited<ReturnType<typeof listAcademicYears>>[number];
export const ACADEMIC_YEARS_KEY = ["admin", "academic-years"] as const;
