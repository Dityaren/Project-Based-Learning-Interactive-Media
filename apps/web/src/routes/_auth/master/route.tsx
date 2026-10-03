import { can } from "@repo/auth/permissions";
import { authQueryOptions } from "@repo/auth/tanstack/queries";
import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/master")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.query({
      ...authQueryOptions(),
      staleTime: "static",
    });

    if (!user || !can(user.role, { system: ["configure"] })) throw redirect({ to: "/login" });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/master"!</div>;
}
