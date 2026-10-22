import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";
import { useForm } from "@tanstack/react-form";
import type { z } from "zod";

import { FormDialog } from "#/components/form-dialog";
import { useAppMutation } from "#/lib/use-app-mutation";

import { createAcademicYear, updateAcademicYear } from "../academic-years.functions";
import { academicYearSchema } from "../schemas";
import { ACADEMIC_YEARS_KEY, type AcademicYearRow } from "../types";

const FORM_ID = "academic-year-form";

/** Create when `row` is omitted, edit otherwise. */
export function AcademicYearDialog({
  row,
  onClose,
}: {
  row?: AcademicYearRow;
  onClose: () => void;
}) {
  const editing = !!row;

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

  const form = useForm({
    defaultValues: {
      name: row?.name ?? "",
      startDate: row?.startDate ?? "",
      endDate: row?.endDate ?? "",
    } as z.input<typeof academicYearSchema>,
    validators: {
      onSubmit: academicYearSchema,
    },
    onSubmit: ({ value }) => {
      const data = academicYearSchema.parse(value);
      if (row) update.mutate({ id: row.id, ...data });
      else create.mutate(data);
    },
  });

  return (
    <FormDialog
      title={editing ? "Edit academic year" : "Add academic year"}
      formId={FORM_ID}
      submitLabel={editing ? "Save changes" : "Create year"}
      pending={m.isPending}
      error={m.error?.message}
      onClose={onClose}
    >
      <form
        id={FORM_ID}
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    id={field.name}
                    type="text"
                    placeholder="2026/2027"
                    autoComplete="off"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />
                  <FieldDescription>Must be unique, for example 2026/2027.</FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <div className="grid grid-cols-2 gap-3">
            <form.Field
              name="startDate"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Start date</FieldLabel>
                    <Input
                      id={field.name}
                      type="date"
                      value={field.state.value}
                      onChange={(event) => field.handleChange(event.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            <form.Field
              name="endDate"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>End date</FieldLabel>
                    <Input
                      id={field.name}
                      type="date"
                      value={field.state.value}
                      onChange={(event) => field.handleChange(event.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
          </div>
        </FieldGroup>
      </form>
    </FormDialog>
  );
}
