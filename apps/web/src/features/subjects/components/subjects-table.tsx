import { Pencil, Trash2 } from "lucide-react";

import { DataTable, type Column } from "#/components/data-table";
import { RowActions } from "#/components/row-actions";

import type { SubjectRow } from "../types";

export type SubjectAction = "edit" | "delete";

type Props = {
  rows?: SubjectRow[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  filtered: boolean; // true when a search is active (changes the empty message)
  onAction: (action: SubjectAction, row: SubjectRow) => void;
};

export function SubjectsTable({ rows, isLoading, isFetching, error, filtered, onAction }: Props) {
  const columns: Column<SubjectRow>[] = [
    {
      id: "code",
      header: "Code",
      cell: (r) => <span className="font-mono text-sm font-medium">{r.code}</span>,
    },
    { id: "name", header: "Name", cell: (r) => r.name },
    {
      id: "usage",
      header: "Teaching slots",
      hideBelow: "md",
      className: "text-muted-foreground",
      cell: (r) => r.assignmentCount,
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      align: "right",
      cell: (r) => (
        <RowActions
          label={`Actions for ${r.code}`}
          actions={[
            { label: "Edit", icon: Pencil, onSelect: () => onAction("edit", r) },
            {
              label: "Delete",
              icon: Trash2,
              destructive: true,
              disabled: r.assignmentCount > 0,
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
      skeletonRows={5}
      empty={
        filtered ? (
          <p>No subjects match your search.</p>
        ) : (
          <>
            <p className="font-medium text-foreground">No subjects yet</p>
            <p>Add the subjects your school teaches.</p>
          </>
        )
      }
    />
  );
}
