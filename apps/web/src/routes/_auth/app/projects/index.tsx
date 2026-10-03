import { can } from "@repo/auth/permissions";
import { authQueryOptions } from "@repo/auth/tanstack/queries";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { ProjectsView, type Filter } from "#/features/projects/projects-view";

const FILTERS = ["all", "draft", "active", "overdue", "completed"] as const;

export const Route = createFileRoute("/_auth/app/projects/")({
  validateSearch: (s: Record<string, unknown>): { q?: string; status?: Filter } => ({
    q: typeof s.q === "string" && s.q ? s.q : undefined,
    status:
      FILTERS.includes(s.status as never) && s.status !== "all" ? (s.status as Filter) : undefined,
  }),
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.query({
      ...authQueryOptions(),
      staleTime: "static",
    });
    void context.queryClient.query(authQueryOptions());

    if (!user) throw redirect({ to: "/login" });
    if (!can(user.role, { project: ["read"] })) throw redirect({ to: "/app" });
  },
  component: () => {
    const { q, status } = Route.useSearch();
    return <ProjectsView q={q} status={status} />;
  },
});
