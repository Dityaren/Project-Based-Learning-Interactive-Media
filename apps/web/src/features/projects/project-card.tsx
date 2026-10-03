import { Link } from "@tanstack/react-router";
import { CalendarClock, ClipboardCheck, Flag, User, Users } from "lucide-react";
import { motion } from "motion/react";

import { ProgressBar } from "#/features/ui";

import { dueLabel, statusMeta, viewStatus, type Project } from "./mock";

export function ProjectCard({
  project: p,
  teacherView,
}: {
  project: Project;
  teacherView: boolean;
}) {
  const status = viewStatus(p);
  const meta = statusMeta[status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
    >
      <Link
        to={`/app/projects/${p.id}` as never}
        className="group flex h-full flex-col gap-4 rounded-xl border bg-card p-4 shadow-xs transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-semibold group-hover:text-primary">{p.title}</h3>
            <p className="truncate text-xs text-muted-foreground">
              {p.subject} · {p.className}
            </p>
          </div>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.cls}`}>
            {meta.label}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="tabular-nums">{p.progress}%</span>
          </div>
          <ProgressBar value={p.progress} />
        </div>

        <dl className="mt-auto grid grid-cols-2 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Flag className="size-3.5" />
            {p.milestonesDone}/{p.milestonesTotal} milestones
          </div>
          <div className="flex items-center gap-1.5">
            {p.teamMode === "team" ? <Users className="size-3.5" /> : <User className="size-3.5" />}
            {p.teamMode === "team" ? `Team of ${p.members}` : "Individual"}
          </div>
          <div
            className={`flex items-center gap-1.5 ${status === "overdue" ? "font-medium text-red-600 dark:text-red-400" : ""}`}
          >
            <CalendarClock className="size-3.5" />
            {dueLabel(p)}
          </div>
          {teacherView ? (
            <div className="flex items-center gap-1.5">
              <ClipboardCheck className="size-3.5" />
              {p.pendingReviews} to review
            </div>
          ) : (
            <div className="flex items-center gap-1.5 truncate">
              <User className="size-3.5 shrink-0" />
              <span className="truncate">{p.teacher}</span>
            </div>
          )}
        </dl>
      </Link>
    </motion.div>
  );
}
