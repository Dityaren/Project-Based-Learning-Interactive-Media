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

import { subjectSchema } from "../schemas";
import { createSubject, updateSubject } from "../subjects.functions";
import { SUBJECTS_KEY, type SubjectRow } from "../types";

const FORM_ID = "subject-form";

/** Create when `row` is omitted, edit otherwise. */
export function SubjectDialog({ row, onClose }: { row?: SubjectRow; onClose: () => void }) {
  const editing = !!row;

  const create = useAppMutation(createSubject, {
    invalidate: SUBJECTS_KEY,
    success: (_, v) => `Created ${v.code}`,
    onDone: onClose,
  });
  const update = useAppMutation(updateSubject, {
    invalidate: SUBJECTS_KEY,
    success: (_, v) => `Updated ${v.code}`,
    onDone: onClose,
  });
  const m = editing ? update : create;

  const form = useForm({
    defaultValues: {
      code: row?.code ?? "",
      name: row?.name ?? "",
    } as z.input<typeof subjectSchema>,
    validators: {
      onSubmit: subjectSchema,
    },
    onSubmit: ({ value }) => {
      const data = subjectSchema.parse(value); // applies the upper-case transform on code
      if (row) update.mutate({ id: row.id, ...data });
      else create.mutate(data);
    },
  });

  return (
    <FormDialog
      title={editing ? "Edit subject" : "Add subject"}
      formId={FORM_ID}
      submitLabel={editing ? "Save changes" : "Create subject"}
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
            name="code"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Code</FieldLabel>
                  <Input
                    id={field.name}
                    type="text"
                    placeholder="PHY-10"
                    autoComplete="off"
                    className="font-mono uppercase"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />
                  <FieldDescription>Short and unique. Saved in capitals.</FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

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
                    placeholder="Physics"
                    autoComplete="off"
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
        </FieldGroup>
      </form>
    </FormDialog>
  );
}
