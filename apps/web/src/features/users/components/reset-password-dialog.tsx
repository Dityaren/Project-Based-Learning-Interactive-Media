import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/field";
import { PasswordInput } from "@repo/ui/components/password-input";
import { useForm } from "@tanstack/react-form";
import type { z } from "zod";

import { FormDialog } from "#/components/form-dialog";

import { setPasswordSchema } from "../schemas";
import type { UserRow } from "../types";
import { useUserMutation } from "../use-user-mutation";
import { setUserPassword } from "../users.functions";

const FORM_ID = "reset-password-form";
const formSchema = setPasswordSchema.pick({ password: true });

export function ResetPasswordDialog({ row, onClose }: { row: UserRow; onClose: () => void }) {
  const m = useUserMutation(setUserPassword, { onDone: onClose, success: "Password updated" });

  const form = useForm({
    defaultValues: {
      password: "",
    } as z.input<typeof formSchema>,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => m.mutate({ userId: row.id, password: value.password }),
  });

  return (
    <FormDialog
      title="Reset password"
      description={
        <>
          Set a new password for <b className="text-foreground">{row.email}</b>.
        </>
      }
      formId={FORM_ID}
      submitLabel="Set password"
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
            name="password"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                  <PasswordInput
                    id={field.name}
                    placeholder="********"
                    autoComplete="new-password"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />
                  <FieldDescription>
                    At least 8 characters. The user is signed out everywhere.
                  </FieldDescription>
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
