import { z } from "zod";

export const subjectSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "Code is too short")
    .max(20, "Code is too long")
    .regex(/^[A-Za-z0-9._-]+$/, "Use letters, numbers, dots, dashes or underscores")
    .transform((v) => v.toUpperCase()),
  name: z.string().trim().min(2, "Name is too short").max(100),
});
export const updateSubjectSchema = subjectSchema.and(z.object({ id: z.uuid() }));
export const idSchema = z.object({ id: z.uuid() });

export type SubjectInput = z.infer<typeof subjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
