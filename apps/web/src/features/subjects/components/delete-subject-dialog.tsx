import { FormDialog } from "#/components/form-dialog";
import { useAppMutation } from "#/lib/use-app-mutation";

import { deleteSubject } from "../subjects.functions";
import { SUBJECTS_KEY, type SubjectRow } from "../types";

export function DeleteSubjectDialog({ row, onClose }: { row: SubjectRow; onClose: () => void }) {
  const m = useAppMutation(deleteSubject, {
    invalidate: SUBJECTS_KEY,
    success: `Deleted ${row.code}`,
    onDone: onClose,
  });

  return (
    <FormDialog
      title="Delete subject"
      description={
        <>
          Delete{" "}
          <b className="text-foreground">
            {row.code} · {row.name}
          </b>
          ? This can't be undone.
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
