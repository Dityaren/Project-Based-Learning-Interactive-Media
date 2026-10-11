import { FormDialog } from "#/components/form-dialog";
import { useAppMutation } from "#/lib/use-app-mutation";

import { activateAcademicYear } from "../academic-years.functions";
import { ACADEMIC_YEARS_KEY, type AcademicYearRow } from "../types";

export function SetActiveDialog({ row, onClose }: { row: AcademicYearRow; onClose: () => void }) {
  const m = useAppMutation(activateAcademicYear, {
    invalidate: ACADEMIC_YEARS_KEY,
    success: `${row.name} is now the active year`,
    onDone: onClose,
  });
  return (
    <FormDialog
      title="Set active year"
      description={
        <>
          Make <b className="text-foreground">{row.name}</b> the active academic year? The current
          active year becomes inactive.
        </>
      }
      submitLabel="Set active"
      pending={m.isPending}
      error={m.error?.message}
      onSubmit={() => m.mutate({ id: row.id })}
      onClose={onClose}
    />
  );
}
