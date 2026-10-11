import { Input } from "@repo/ui/components/input";
import { useState } from "react";

import { FormDialog } from "#/components/form-dialog";
import { FormField } from "#/components/form-field";
import { useAppMutation } from "#/lib/use-app-mutation";

import { createAcademicYear, updateAcademicYear } from "../academic-years.functions";
import { academicYearSchema } from "../schemas";
import { ACADEMIC_YEARS_KEY, type AcademicYearRow } from "../types";

export function AcademicYearDialog({
  row,
  onClose,
}: {
  row?: AcademicYearRow;
  onClose: () => void;
}) {
  const editing = !!row;
  const [form, setForm] = useState({
    name: row?.name ?? "",
    startDate: row?.startDate ?? "",
    endDate: row?.endDate ?? "",
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const create = useAppMutation(createAcademicYear, {
    invalidate: ACADEMIC_YEARS_KEY,
    success: (_, v) => `Created ${v.name}`,
    onDone: onClose,
  });
  const update = useAppMutation(updateAcademicYear, {
    invalidate: ACADEMIC_YEARS_KEY,
    success: (_, v) => `Updated ${v.name}`,
    onDone: onClose,
  });
  const m = editing ? update : create;

  const submit = () => {
    const parsed = academicYearSchema.safeParse(form);
    if (!parsed.success) return setLocalError(parsed.error.issues[0]?.message ?? "Invalid input");
    setLocalError(null);
    if (row) update.mutate({ id: row.id, ...parsed.data });
    else create.mutate(parsed.data);
  };

  return (
    <FormDialog
      title={editing ? "Edit academic year" : "Add academic year"}
      submitLabel={editing ? "Save changes" : "Create year"}
      pending={m.isPending}
      error={localError ?? m.error?.message}
      onSubmit={submit}
      onClose={onClose}
    >
      <FormField label="Name" htmlFor="name" hint="For example 2026/2027">
        <Input id="name" value={form.name} onChange={set("name")} autoFocus />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Start date" htmlFor="start">
          <Input id="start" type="date" value={form.startDate} onChange={set("startDate")} />
        </FormField>
        <FormField label="End date" htmlFor="end">
          <Input id="end" type="date" value={form.endDate} onChange={set("endDate")} />
        </FormField>
      </div>
    </FormDialog>
  );
}
