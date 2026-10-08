import { z } from "zod";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date");
const base = z.object({
  name: z.string().trim().min(2, "Name is too short").max(50),
  startDate: date,
  endDate: date,
});
const endAfterStart = { message: "End date must be after the start date", path: ["endDate"] };

export const academicYearSchema = base.refine((v) => v.endDate > v.startDate, endAfterStart);
export const updateAcademicYearSchema = base
  .extend({ id: z.string().uuid() })
  .refine((v) => v.endDate > v.startDate, endAfterStart);
export const idSchema = z.object({ id: z.string().uuid() });

export type AcademicYearInput = z.infer<typeof academicYearSchema>;
export type UpdateAcademicYearInput = z.infer<typeof updateAcademicYearSchema>;
