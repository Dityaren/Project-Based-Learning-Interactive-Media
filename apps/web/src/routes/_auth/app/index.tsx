// apps/web/src/routes/_auth/app/index.tsx
import { useAuthSuspense } from "@repo/auth/tanstack/hooks";
import { createFileRoute } from "@tanstack/react-router";

import { Page } from "#/components/page-kit";
import { AdminDashboard } from "#/features/dashboard/admin";
import { StudentDashboard } from "#/features/dashboard/student";
import { TeacherDashboard } from "#/features/dashboard/teacher";

export const Route = createFileRoute("/_auth/app/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuthSuspense();
  const first = user?.name?.split(" ")[0] ?? "there";

  switch (user?.role) {
    case "teacher":
      return (
        <Page title={`Welcome back, ${first}`} subtitle="Here's what needs your attention today.">
          <TeacherDashboard />
        </Page>
      );
    case "admin":
    // @ts-ignore -> FALLTHROUGH SOMETHING SOMETHING
    case "master":
      return (
        <Page title={`Welcome back, ${first}`} subtitle="Platform overview and recent activity.">
          {/* @ts-ignore -> MAAFKAN AKU TYPESCRIPT */ null}
          <AdminDashboard isMaster={user.role === "master"} />
        </Page>
      );
    default:
      return (
        <Page title={`Welcome back, ${first}`} subtitle="Pick up where you left off.">
          <StudentDashboard />
        </Page>
      );
  }
}
