import { useAuthSuspense } from "@repo/auth/tanstack/hooks";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/_auth/app/")({
  component: AppIndex,
});

function AppIndex() {
  const { user } = useAuthSuspense();

  return (
    <main className="flex-1 space-y-8 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {user?.name ?? "User"}
        </h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your learning progress.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Projects"
          value="12"
          description="+2 this month"
          icon={<FolderKanban className="size-4" />}
        />
        <DashboardCard
          title="Completed"
          value="8"
          description="+3 this month"
          icon={<CheckCircle2 className="size-4" />}
        />
        <DashboardCard
          title="Learning Hours"
          value="24.5h"
          description="+4.2h this week"
          icon={<Clock3 className="size-4" />}
        />
        <DashboardCard
          title="Progress"
          value="68%"
          description="+8% this month"
          icon={<Activity className="size-4" />}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-7">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm lg:col-span-4">
          <div className="flex items-center justify-between border-b p-6">
            <div>
              <h2 className="font-semibold">Recent Projects</h2>
              <p className="text-sm text-muted-foreground">Your latest learning projects.</p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
            >
              View all
              <ArrowUpRight className="size-4" />
            </button>
          </div>

          <div className="divide-y">
            <ProjectItem
              icon={<BookOpen className="size-4" />}
              title="Interactive Web Portfolio"
              description="Web Programming"
              status="In progress"
              progress={75}
            />
            <ProjectItem
              icon={<FolderKanban className="size-4" />}
              title="Student Management System"
              description="Database Programming"
              status="In progress"
              progress={45}
            />
            <ProjectItem
              icon={<CheckCircle2 className="size-4" />}
              title="Personal Landing Page"
              description="Web Programming"
              status="Completed"
              progress={100}
            />
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm lg:col-span-3">
          <div className="border-b p-6">
            <h2 className="font-semibold">Recent Activity</h2>
            <p className="text-sm text-muted-foreground">Your latest activity.</p>
          </div>

          <div className="divide-y">
            <ActivityItem
              title="Completed a project"
              description="Personal Landing Page"
              time="2 hours ago"
            />
            <ActivityItem
              title="Started a new project"
              description="Student Management System"
              time="Yesterday"
            />
            <ActivityItem
              title="Completed a lesson"
              description="JavaScript Functions"
              time="2 days ago"
            />
            <ActivityItem
              title="Joined a discussion"
              description="Web Programming"
              time="3 days ago"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center gap-3 border-b p-6">
          <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
            <Users className="size-4" />
          </div>
          <div>
            <h2 className="font-semibold">Continue Learning</h2>
            <p className="text-sm text-muted-foreground">Pick up where you left off.</p>
          </div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-3">
          <LearningCard title="HTML & CSS Fundamentals" category="Web Programming" progress={82} />
          <LearningCard title="JavaScript Basics" category="Programming" progress={64} />
          <LearningCard title="Database Fundamentals" category="Database" progress={38} />
        </div>
      </section>
    </main>
  );
}

function DashboardCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>

      <div className="mt-3 text-2xl font-bold tracking-tight">{value}</div>

      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function ProjectItem({
  icon,
  title,
  description,
  status,
  progress,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: string;
  progress: number;
}) {
  return (
    <div className="flex items-center gap-4 p-5">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-4">
          <p className="truncate text-sm font-medium">{title}</p>
          <span className="shrink-0 text-xs text-muted-foreground">{status}</span>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">{description}</p>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function ActivityItem({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="p-5">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <p className="mt-2 text-xs text-muted-foreground">{time}</p>
    </div>
  );
}

function LearningCard({
  title,
  category,
  progress,
}: {
  title: string;
  category: string;
  progress: number;
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
        <BookOpen className="size-4" />
      </div>

      <h3 className="mt-4 font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{category}</p>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium">{progress}%</span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
