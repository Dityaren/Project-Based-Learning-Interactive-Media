// features/users/components/users-view.tsx
import { can } from "@repo/auth/permissions";
import { useAuthSuspense } from "@repo/auth/tanstack/hooks";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Page } from "#/components/page-kit";

import { MANAGEABLE } from "../constants";
import type { UserRow, UsersSearch } from "../types";
import { USERS_KEY } from "../use-user-mutation";
import { listUsers } from "../users.functions";
import { BanUserDialog } from "./ban-user-dialog";
import { ChangeRoleDialog } from "./change-role-dialog";
import { CreateUserDialog } from "./create-user-dialog";
import { ResetPasswordDialog } from "./reset-password-dialog";
import { UsersTable, type UserAction } from "./users-table";
import { UsersToolbar } from "./users-toolbar";

type Dialog = null | { kind: "create" } | { kind: UserAction; row: UserRow };

const PAGE_SIZE = 10;

export function UsersView({
  search,
  onSearch,
}: {
  search: UsersSearch;
  onSearch: (patch: Partial<UsersSearch>) => void;
}) {
  const { user: me } = useAuthSuspense();
  const [dialog, setDialog] = useState<Dialog>(null);
  const close = () => setDialog(null);

  const page = search.page ?? 1;
  const assignable = MANAGEABLE[me?.role ?? ""] ?? [];

  const { data, isPending, isFetching, error } = useQuery({
    queryKey: [...USERS_KEY, { ...search, page }],
    queryFn: () =>
      listUsers({
        data: { q: search.q, role: search.role, status: search.status, page, pageSize: PAGE_SIZE },
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <Page title="Users" subtitle="Create accounts, assign roles, and deactivate access.">
      <UsersToolbar
        search={search}
        onSearch={onSearch}
        onCreate={
          can(me?.role, { user: ["create"] }) ? () => setDialog({ kind: "create" }) : undefined
        }
      />

      <UsersTable
        rows={data?.rows}
        total={data?.total ?? 0}
        page={page}
        pageSize={PAGE_SIZE}
        isLoading={isPending}
        isFetching={isFetching}
        error={error}
        currentUserId={me?.id}
        assignable={assignable}
        onPageChange={(p) => onSearch({ page: p > 1 ? p : undefined })}
        onAction={(kind, row) => setDialog({ kind, row })}
      />

      {dialog?.kind === "create" && <CreateUserDialog assignable={assignable} onClose={close} />}
      {dialog?.kind === "role" && (
        <ChangeRoleDialog row={dialog.row} assignable={assignable} onClose={close} />
      )}
      {dialog?.kind === "ban" && <BanUserDialog row={dialog.row} onClose={close} />}
      {dialog?.kind === "password" && <ResetPasswordDialog row={dialog.row} onClose={close} />}
    </Page>
  );
}
