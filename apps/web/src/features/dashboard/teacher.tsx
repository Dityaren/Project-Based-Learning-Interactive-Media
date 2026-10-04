import { AlarmClockOff, ClipboardCheck, FolderKanban, School } from "lucide-react";

import { Grid, Panel, Pill, ProgressBar, Row, StatCard } from "#/components/page-kit";

import { teacher } from "./mock";

export function TeacherDashboard() {
  const t = teacher;
  return (
    <>
      <Grid>
        <StatCard label="My classes" value={t.stats.classes} icon={School} />
        <StatCard label="Active projects" value={t.stats.activeProjects} icon={FolderKanban} />
        <StatCard
          label="Pending reviews"
          value={t.stats.pending}
          icon={ClipboardCheck}
          hint="Waiting for grading"
        />
        <StatCard
          label="Late submissions"
          value={t.stats.late}
          icon={AlarmClockOff}
          hint="Past deadline"
        />
      </Grid>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Needs review"
          action={{ label: "Open queue", to: "/app/submissions" }}
          className="lg:col-span-2"
        >
          <ul className="divide-y">
            {t.review.map((r) => (
              <Row key={r.student + r.project}>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.student}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {r.project} · {r.submitted}
                  </p>
                </div>
                {r.late ? <Pill tone="late">Late</Pill> : <Pill>New</Pill>}
              </Row>
            ))}
          </ul>
        </Panel>

        <Panel title="Upcoming deadlines">
          <ul className="divide-y">
            {t.deadlines.map((d) => (
              <Row key={d.title}>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{d.title}</p>
                  <p className="text-xs text-muted-foreground">{d.cls}</p>
                </div>
                <Pill tone="soon">{d.due}</Pill>
              </Row>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Project progress by class" action={{ label: "Classes", to: "/app/classes" }}>
        <ul className="grid gap-4 sm:grid-cols-2">
          {t.classes.map((c) => (
            <li key={c.name} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{c.name}</span>
                <span className="text-muted-foreground tabular-nums">{c.progress}%</span>
              </div>
              <ProgressBar value={c.progress} />
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
