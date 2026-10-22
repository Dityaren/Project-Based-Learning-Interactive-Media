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

import { setBanSchema } from "../schemas";
import type { UserRow } from "../types";
import { useUserMutation } from "../use-user-mutation";
import { setUserBan } from "../users.functions";

const FORM_ID = "ban-user-form";
const formSchema = setBanSchema.pick({ reason: true });

export function BanUserDialog({ row, onClose }: { row: UserRow; onClose: () => void }) {
  const banning = !row.banned;

  const m = useUserMutation(setUserBan, {
    onDone: onClose,
    success: (_, v) => (v.banned ? "Account deactivated" : "Account reactivated"),
  });

  const form = useForm({
    defaultValues: {
      reason: "",
    } as z.input<typeof formSchema>,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) =>
      m.mutate({ userId: row.id, banned: banning, reason: value.reason?.trim() || undefined }),
  });

  return (
    <FormDialog
      title={banning ? "Deactivate account" : "Reactivate account"}
      description={
        banning ? (
          <>
            This signs <b className="text-foreground">{row.email}</b> out everywhere and blocks
            login.
          </>
        ) : (
          <>
            Allow <b className="text-foreground">{row.email}</b> to sign in again.
          </>
        )
      }
      formId={FORM_ID}
      submitLabel={banning ? "Deactivate" : "Reactivate"}
      destructive={banning}
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
        {banning && (
          <FieldGroup>
            <form.Field
              name="reason"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Reason (optional)</FieldLabel>
                    <Input
                      id={field.name}
                      type="text"
                      placeholder="For example: left the school"
                      autoComplete="off"
                      value={field.state.value ?? ""}
                      onChange={(event) => field.handleChange(event.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    <FieldDescription>
                      Recorded in the audit log. Up to 200 characters.
                    </FieldDescription>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        )}
      </form>
    </FormDialog>
  );
}
