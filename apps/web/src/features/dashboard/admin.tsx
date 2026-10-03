// apps/web/src/features/dashboard/admin.tsx
import { Link } from "@tanstack/react-router";
import {
  BookUser,
  FolderKanban,
  GraduationCap,
  School,
  ScrollText,
  SlidersHorizontal,
  UserPlus,
} from "lucide-react";

import { admin } from "./mock";
import { Grid, Panel, Row, StatCard } from "./ui";

export function AdminDashboard({ isMaster }: { isMaster: boolean }) {
  const a = admin;
  const actions = [
    { label: "Add user", to: "/app/admin/users", icon: UserPlus },
    { label: "Manage classes", to: "/app/classes", icon: School },
    { label: "Audit logs", to: "/app/admin/audit-logs", icon: ScrollText },
    ...(isMaster
      ? [{ label: "System configuration", to: "/app/master/config", icon: SlidersHorizontal }]
      : []),
  ];

  return (
    <>
      <Grid>
        <StatCard label="Students" value={a.stats.students} icon={GraduationCap} />
        <StatCard label="Teachers" value={a.stats.teachers} icon={BookUser} />
        <StatCard label="Classes" value={a.stats.classes} icon={School} />
        <StatCard label="Active projects" value={a.stats.activeProjects} icon={FolderKanban} />
      </Grid>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Recent activity"
          action={{ label: "Audit logs", to: "/app/admin/audit-logs" }}
          className="lg:col-span-2"
        >
          <ul className="divide-y">
            {a.activity.map((e) => (
              <Row key={e.what}>
                <p className="min-w-0 text-sm">
                  <span className="font-medium">{e.who}</span>{" "}
                  <span className="text-muted-foreground">{e.what}</span>
                </p>
                <span className="shrink-0 text-xs text-muted-foreground">{e.when}</span>
              </Row>
            ))}
          </ul>
        </Panel>

        <Panel title="Quick actions">
          <div className="grid gap-2">
            {actions.map((x) => (
              <Link
                key={x.to}
                to={x.to as never}
                className="flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors hover:bg-muted"
              >
                <x.icon className="size-4 text-primary" /> {x.label}
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
