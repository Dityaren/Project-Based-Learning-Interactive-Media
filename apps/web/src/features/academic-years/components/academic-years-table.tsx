import { CheckCircle2, Pencil, Trash2 } from "lucide-react";

import { DataTable, type Column } from "#/components/data-table";
import { RowActions } from "#/components/row-actions";
import { StatusBadge } from "#/components/status-badge";
import { formatDate } from "#/lib/format";

import type { AcademicYearRow } from "../types";

export type YearAction = "edit" | "activate" | "delete";

type Props = {
  rows?: AcademicYearRow[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  onAction: (action: YearAction, row: AcademicYearRow) => void;
};

export function AcademicYearsTable({ rows, isLoading, isFetching, error, onAction }: Props) {
  const columns: Column<AcademicYearRow>[] = [
    {
      id: "name",
      header: "Academic year",
      cell: (r) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{r.name}</span>
          {r.isActive && <StatusBadge tone="success">Active</StatusBadge>}
        </div>
      ),
    },
    {
      id: "period",
      header: "Period",
      hideBelow: "sm",
      className: "text-muted-foreground",
      cell: (r) => `${formatDate(r.startDate)} – ${formatDate(r.endDate)}`,
    },
    { id: "classes", header: "Classes", hideBelow: "md", cell: (r) => r.classCount },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      align: "right",
      cell: (r) => (
        <RowActions
          label={`Actions for ${r.name}`}
          actions={[
            { label: "Edit", icon: Pencil, onSelect: () => onAction("edit", r) },
            {
              label: "Set active",
              icon: CheckCircle2,
              disabled: r.isActive,
              onSelect: () => onAction("activate", r),
            },
            {
              label: "Delete",
              icon: Trash2,
              destructive: true,
              disabled: r.isActive || r.classCount > 0,
              onSelect: () => onAction("delete", r),
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
      skeletonRows={4}
      empty={
        <>
          <p className="font-medium text-foreground">No academic years yet</p>
          <p>Add one to start creating classes.</p>
        </>
      }
    />
  );
}
