import { can } from "@repo/auth/permissions";
import { authQueryOptions } from "@repo/auth/tanstack/queries";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { UsersView } from "#/features/users/components/users-view";
import { ROLES, type Role } from "#/features/users/constants";
import type { UsersSearch } from "#/features/users/types";

export const Route = createFileRoute("/_auth/app/admin/users/")({
  validateSearch: (s: Record<string, unknown>): UsersSearch => ({
    q: typeof s.q === "string" && s.q ? s.q : undefined,
    role: ROLES.includes(s.role as Role) ? (s.role as Role) : undefined,
    status: s.status === "active" || s.status === "banned" ? s.status : undefined,
    page: Number.isInteger(Number(s.page)) && Number(s.page) > 1 ? Number(s.page) : undefined,
  }),
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.query({ ...authQueryOptions(), staleTime: "static" });
    void context.queryClient.query(authQueryOptions());

    if (!user) throw redirect({ to: "/login" });
    if (!can(user.role, { user: ["list"] })) throw redirect({ to: "/app" });
  },
  component: UsersPage,
});

function UsersPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <UsersView
      search={search}
      onSearch={(patch) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })}
    />
  );
}
