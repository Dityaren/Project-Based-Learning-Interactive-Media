import { can } from "@repo/auth/permissions";
import { authQueryOptions } from "@repo/auth/tanstack/queries";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { AcademicYearsView } from "#/features/academic-years/components/academic-years-view";

export const Route = createFileRoute("/_auth/app/admin/academic-years/")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.query({ ...authQueryOptions(), staleTime: "static" });
    void context.queryClient.query(authQueryOptions());

    if (!user) throw redirect({ to: "/login" });
    if (!can(user.role, { academic: ["manage"] })) throw redirect({ to: "/app" });
  },
  component: AcademicYearsView,
});
