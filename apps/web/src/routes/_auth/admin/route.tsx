import { can } from "@repo/auth/permissions";
import { authQueryOptions } from "@repo/auth/tanstack/queries";
import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/admin")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.query({
      ...authQueryOptions(),
      staleTime: "static",
    });

    if (!user || !can(user.role, { academic: ["manage"] })) throw redirect({ to: "/login" });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/admin"!</div>;
}
