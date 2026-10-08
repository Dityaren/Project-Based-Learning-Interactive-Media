import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import type { ReactNode } from "react";

const HIDE = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
} as const;

export type Column<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  hideBelow?: keyof typeof HIDE;
  align?: "right";
  className?: string;
};

type Props<T> = {
  columns: Column<T>[];
  rows?: T[];
  getRowId: (row: T) => string;
  isLoading?: boolean;
  isFetching?: boolean;
  error?: Error | null;
  empty?: ReactNode;
  skeletonRows?: number;
  footer?: ReactNode;
};

const cellClass = <T,>(c: Column<T>) =>
  [
    c.hideBelow ? HIDE[c.hideBelow] : "",
    c.align === "right" ? "text-right" : "",
    c.className ?? "",
  ].join(" ");

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  isLoading,
  isFetching,
  error,
  empty,
  skeletonRows = 8,
  footer,
}: Props<T>) {
  const showRows = !isLoading && !error && rows && rows.length > 0;

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table
        className={
          isFetching && !isLoading ? "opacity-60 transition-opacity" : "transition-opacity"
        }
      >
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {columns.map((c) => (
              <TableHead key={c.id} className={cellClass(c)}>
                {c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: skeletonRows }, (_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {columns.map((c) => (
                  <TableCell key={c.id} className={cellClass(c)}>
                    <Skeleton className="h-5 w-full max-w-40" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          {showRows &&
            rows.map((row) => (
              <TableRow key={getRowId(row)}>
                {columns.map((c) => (
                  <TableCell key={c.id} className={cellClass(c)}>
                    {c.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {error && (
        <p role="alert" className="py-12 text-center text-sm text-destructive">
          {error.message}
        </p>
      )}
      {!isLoading && !error && rows?.length === 0 && (
        <div className="py-14 text-center text-sm text-muted-foreground">
          {empty ?? "No results."}
        </div>
      )}
      {!isLoading && !error && footer}
    </div>
  );
}
