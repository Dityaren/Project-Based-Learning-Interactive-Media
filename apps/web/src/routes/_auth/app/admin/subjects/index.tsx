import { can } from "@repo/auth/permissions";
import { authQueryOptions } from "@repo/auth/tanstack/queries";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { SubjectsView } from "#/features/subjects/components/subjects-view";

export const Route = createFileRoute("/_auth/app/admin/subjects/")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.query({ ...authQueryOptions(), staleTime: "static" });

    if (!user) throw redirect({ to: "/login" });
    if (!can(user.role, { academic: ["manage"] })) throw redirect({ to: "/app" });
  },
  component: SubjectsView,
});
