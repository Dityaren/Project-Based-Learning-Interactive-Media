import { FormDialog } from "#/components/form-dialog";
import { useAppMutation } from "#/lib/use-app-mutation";

import { deleteAcademicYear } from "../academic-years.functions";
import { ACADEMIC_YEARS_KEY, type AcademicYearRow } from "../types";

export function DeleteAcademicYearDialog({
  row,
  onClose,
}: {
  row: AcademicYearRow;
  onClose: () => void;
}) {
  const m = useAppMutation(deleteAcademicYear, {
    invalidate: ACADEMIC_YEARS_KEY,
    success: `Deleted ${row.name}`,
    onDone: onClose,
  });
  return (
    <FormDialog
      title="Delete academic year"
      description={
        <>
          Delete <b className="text-foreground">{row.name}</b>? This can't be undone.
        </>
      }
      submitLabel="Delete"
      destructive
      pending={m.isPending}
      error={m.error?.message}
      onSubmit={() => m.mutate({ id: row.id })}
      onClose={onClose}
    />
  );
}
