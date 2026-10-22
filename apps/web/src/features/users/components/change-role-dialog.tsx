import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useForm } from "@tanstack/react-form";
import type { z } from "zod";

import { FormDialog } from "#/components/form-dialog";

import { ROLE_LABEL, roleOptions, type Role } from "../constants";
import { setRoleSchema } from "../schemas";
import type { UserRow } from "../types";
import { useUserMutation } from "../use-user-mutation";
import { setUserRole } from "../users.functions";

const FORM_ID = "change-role-form";
const formSchema = setRoleSchema.pick({ role: true });

export function ChangeRoleDialog({
  row,
  assignable,
  onClose,
}: {
  row: UserRow;
  assignable: readonly Role[];
  onClose: () => void;
}) {
  const options = roleOptions(assignable);

  const m = useUserMutation(setUserRole, {
    onDone: onClose,
    success: (_, v) => `Role changed to ${ROLE_LABEL[v.role]}`,
  });

  const form = useForm({
    defaultValues: {
      role: (row.role ?? "student") as Role,
    } as z.input<typeof formSchema>,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => m.mutate({ userId: row.id, role: value.role }),
  });

  return (
    <FormDialog
      title="Change role"
      description={
        <>
          Update the role for <b className="text-foreground">{row.email}</b>.
        </>
      }
      formId={FORM_ID}
      submitLabel="Save role"
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
            name="role"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                  <Select
                    items={options}
                    value={field.state.value}
                    onValueChange={(value) => value && field.handleChange(value as Role)}
                  >
                    <SelectTrigger id={field.name} aria-invalid={isInvalid} className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>Takes effect on the user's next sign-in.</FieldDescription>
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
