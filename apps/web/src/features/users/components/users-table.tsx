import { Ban, KeyRound, RotateCcw, ShieldCheck } from "lucide-react";

import { DataTable, type Column } from "#/components/data-table";
import { RowActions } from "#/components/row-actions";
import { StatusBadge } from "#/components/status-badge";
import { TablePagination } from "#/components/table-pagination";
import { UserAvatar } from "#/components/user-avatar";

import type { Role } from "../constants";
import type { UserRow } from "../types";
import { RoleBadge } from "./role-badge";

export type UserAction = "role" | "password" | "ban";

type Props = {
  rows?: UserRow[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  currentUserId?: string;
  assignable: readonly Role[];
  onPageChange: (page: number) => void;
  onAction: (action: UserAction, row: UserRow) => void;
};

export function UsersTable({
  rows,
  total,
  page,
  pageSize,
  isLoading,
  isFetching,
  error,
  currentUserId,
  assignable,
  onPageChange,
  onAction,
}: Props) {
  const canManage = (r: UserRow) =>
    r.id !== currentUserId && assignable.includes((r.role ?? "student") as Role);

  const columns: Column<UserRow>[] = [
    {
      id: "user",
      header: "User",
      cell: (r) => (
        <div className="flex items-center gap-3">
          <UserAvatar name={r.name} image={r.image} className="size-9" />
          <div className="min-w-0">
            <p className="truncate font-medium">
              {r.name}
              {r.id === currentUserId && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">(you)</span>
              )}
            </p>
            <p className="truncate text-xs text-muted-foreground">{r.email}</p>
          </div>
        </div>
      ),
    },
    { id: "role", header: "Role", cell: (r) => <RoleBadge role={r.role} /> },
    {
      id: "status",
      header: "Status",
      cell: (r) =>
        r.banned ? (
          <StatusBadge tone="danger" title={r.banReason ?? undefined}>
            Deactivated
          </StatusBadge>
        ) : (
          <StatusBadge tone="success">Active</StatusBadge>
        ),
    },
    {
      id: "joined",
      header: "Joined",
      hideBelow: "md",
      className: "text-muted-foreground",
      cell: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      align: "right",
      cell: (r) => (
        <RowActions
          label={`Actions for ${r.name}`}
          actions={[
            {
              label: "Change role",
              icon: ShieldCheck,
              disabled: !canManage(r),
              onSelect: () => onAction("role", r),
            },
            {
              label: "Reset password",
              icon: KeyRound,
              disabled: !canManage(r),
              onSelect: () => onAction("password", r),
            },
            {
              label: r.banned ? "Reactivate" : "Deactivate",
              icon: r.banned ? RotateCcw : Ban,
              destructive: !r.banned,
              disabled: !canManage(r),
              onSelect: () => onAction("ban", r),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowId={(r) => r.id}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      empty={
        <>
          <p className="font-medium text-foreground">No users found</p>
          <p>Try a different search or filter.</p>
        </>
      }
      footer={
        <TablePagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
          noun="users"
        />
      }
    />
  );
}
