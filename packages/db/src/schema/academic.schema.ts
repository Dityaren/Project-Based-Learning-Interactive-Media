import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth.schema";

const createdAt = () => timestamp("created_at").defaultNow().notNull();

export const academicYear = pgTable(
  "academic_year",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    startDate: date("start_date", { mode: "string" }).notNull(),
    endDate: date("end_date", { mode: "string" }).notNull(),
    isActive: boolean("is_active").notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("academic_year_single_active")
      .on(t.isActive)
      .where(sql`${t.isActive}`),
  ],
);

export const subject = pgTable("subject", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  createdAt: createdAt(),
});

export const schoolClass = pgTable(
  "class",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    academicYearId: uuid("academic_year_id")
      .notNull()
      .references(() => academicYear.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    gradeLevel: text("grade_level"),
    createdAt: createdAt(),
  },
  (t) => [unique("class_year_name_unique").on(t.academicYearId, t.name)],
);

export const enrollment = pgTable(
  "enrollment",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    classId: uuid("class_id")
      .notNull()
      .references(() => schoolClass.id, { onDelete: "restrict" }),
    studentId: text("student_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: text("status", { enum: ["active", "withdrawn"] })
      .notNull()
      .default("active"),
    createdAt: createdAt(),
  },
  (t) => [unique("enrollment_class_student_unique").on(t.classId, t.studentId)],
);

export const teachingAssignment = pgTable(
  "teaching_assignment",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    classId: uuid("class_id")
      .notNull()
      .references(() => schoolClass.id, { onDelete: "restrict" }),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subject.id, { onDelete: "restrict" }),
    teacherId: text("teacher_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (t) => [unique("teaching_assignment_unique").on(t.classId, t.subjectId, t.teacherId)],
);
