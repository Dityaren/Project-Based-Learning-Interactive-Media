import { can } from "@repo/auth/permissions";
import { useAuthSuspense } from "@repo/auth/tanstack/hooks";
import { Link, useNavigate } from "@tanstack/react-router";
import { FolderOpen, Plus, Search } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useMemo } from "react";

import { Page } from "#/features/dashboard/ui";

import { getProjects, viewStatus, type ViewStatus } from "./mock";
import { ProjectCard } from "./project-card";

export type Filter = "all" | ViewStatus;

export function ProjectsView({ q = "", status = "all" }: { q?: string; status?: Filter }) {
  const { user } = useAuthSuspense();
  const navigate = useNavigate();
  const teacherView = user?.role === "teacher";
  const canCreate = can(user?.role, { project: ["create"] });

  const projects = useMemo(() => getProjects(user?.role), [user?.role]);

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    ...(teacherView ? [{ key: "draft" as const, label: "Drafts" }] : []),
    { key: "active", label: "Active" },
    { key: "overdue", label: "Overdue" },
    { key: "completed", label: "Completed" },
  ];

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    for (const p of projects) c[viewStatus(p)] = (c[viewStatus(p)] ?? 0) + 1;
    return c;
  }, [projects]);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (status === "all" || viewStatus(p) === status) &&
        (!needle ||
          `${p.title} ${p.subject} ${p.className} ${p.teacher}`.toLowerCase().includes(needle)),
    );
  }, [projects, q, status]);

  const setSearch = (next: { q?: string; status?: Filter }) =>
    navigate({
      to: ".",
      replace: true,
      search: (prev: { q?: string; status?: Filter }) => ({
        q: next.q !== undefined ? next.q || undefined : prev.q,
        status:
          next.status !== undefined
            ? next.status === "all"
              ? undefined
              : next.status
            : prev.status,
      }),
    } as never);

  return (
    <Page
      title="Projects"
      subtitle={
        teacherView
          ? "Create, manage, and review your class projects."
          : "Your enrolled projects and their progress."
      }
    >
      <MotionConfig reducedMotion="user">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={q}
              onChange={(e) => setSearch({ q: e.target.value })}
              placeholder="Search by title, subject, class…"
              className="h-10 w-full rounded-lg border bg-background pr-3 pl-9 text-sm transition-shadow outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          {canCreate && (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to={"/app/projects/new" as never}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
              >
                <Plus className="size-4" /> New project
              </Link>
            </motion.div>
          )}
        </div>

        <div role="tablist" aria-label="Filter by status" className="flex flex-wrap gap-1">
          {tabs.map((t) => {
            const active = status === t.key;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                onClick={() => setSearch({ status: t.key })}
                className={`relative rounded-lg px-3 py-1.5 text-sm transition-colors ${active ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {active && (
                  <motion.span
                    layoutId="project-tab"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    className="absolute inset-0 rounded-lg bg-primary/10 ring-1 ring-primary/15"
                  />
                )}
                <span className="relative z-10">
                  {t.label}
                  <span className="ml-1.5 text-xs text-muted-foreground tabular-nums">
                    {counts[t.key] ?? 0}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-center">
            <FolderOpen className="size-8 text-muted-foreground" />
            <p className="font-medium">
              {projects.length === 0 ? "No projects yet" : "No projects match your filters"}
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              {projects.length === 0
                ? teacherView
                  ? "Create your first project to get your class started."
                  : "Your teacher hasn't assigned a project yet."
                : "Try a different search or status."}
            </p>
            {projects.length > 0 && (
              <button
                onClick={() => setSearch({ q: "", status: "all" })}
                className="mt-2 text-sm text-primary underline-offset-4 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((p) => (
                <ProjectCard key={p.id} project={p} teacherView={teacherView} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </MotionConfig>
    </Page>
  );
}
