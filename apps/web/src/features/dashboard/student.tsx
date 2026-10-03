import { CalendarClock, CheckCheck, FolderKanban, Trophy } from "lucide-react";

import { Empty, Grid, Panel, Pill, ProgressBar, Row, StatCard } from "../ui";
import { student } from "./mock";

export function StudentDashboard() {
  const s = student;
  return (
    <>
      <Grid>
        <StatCard
          label="Active projects"
          value={s.stats.active}
          icon={FolderKanban}
          hint="In progress now"
        />
        <StatCard
          label="Due this week"
          value={s.stats.dueThisWeek}
          icon={CalendarClock}
          hint="Tasks and milestones"
        />
        <StatCard
          label="Average score"
          value={`${s.stats.avgScore}%`}
          icon={Trophy}
          hint="Across graded work"
        />
        <StatCard
          label="Milestones"
          value={s.stats.milestonesDone}
          icon={CheckCheck}
          hint="Completed"
        />
      </Grid>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Active projects"
          action={{ label: "View all", to: "/app/projects" }}
          className="lg:col-span-2"
        >
          {s.projects.length === 0 ? (
            <Empty>No projects yet. Your teacher will assign one soon.</Empty>
          ) : (
            <ul className="divide-y">
              {s.projects.map((p) => (
                <li key={p.title} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.subject} · Next: {p.next}
                      </p>
                    </div>
                    <Pill>Due {p.due}</Pill>
                  </div>
                  <div className="flex items-center gap-3">
                    <ProgressBar value={p.progress} />
                    <span className="w-9 text-right text-xs text-muted-foreground tabular-nums">
                      {p.progress}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Upcoming deadlines">
          <ul className="divide-y">
            {s.deadlines.map((d) => (
              <Row key={d.title}>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{d.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{d.project}</p>
                </div>
                <Pill tone={d.tone}>{d.tone === "late" ? "Overdue" : d.due}</Pill>
              </Row>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Recent teacher feedback" action={{ label: "All feedback", to: "/app/grades" }}>
        <ul className="divide-y">
          {s.feedback.map((f) => (
            <Row key={f.project}>
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {f.project} <span className="font-normal text-muted-foreground">· {f.from}</span>
                </p>
                <p className="truncate text-sm text-muted-foreground">{f.text}</p>
              </div>
              {f.score != null ? (
                <Pill tone="ok">{f.score}%</Pill>
              ) : (
                <Pill tone="soon">Revise</Pill>
              )}
            </Row>
          ))}
        </ul>
      </Panel>
    </>
  );
}
