import { Button } from "@repo/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";
import { PasswordInput } from "@repo/ui/components/password-input";
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

import { roleOptions, type Role } from "../constants";
import { createUserSchema } from "../schemas";
import { useUserMutation } from "../use-user-mutation";
import { createUser } from "../users.functions";

const FORM_ID = "create-user-form";

const generatePassword = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return btoa(String.fromCharCode(...bytes))
    .replace(/[+/=]/g, "")
    .slice(0, 14);
};

export function CreateUserDialog({
  assignable,
  onClose,
}: {
  assignable: readonly Role[];
  onClose: () => void;
}) {
  const options = roleOptions(assignable);

  const m = useUserMutation(createUser, {
    onDone: onClose,
    success: (_, v) => `Created account for ${v.email}`,
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "student",
      password: "",
    } as z.input<typeof createUserSchema>,
    validators: {
      onSubmit: createUserSchema,
    },
    onSubmit: ({ value }) => m.mutate(createUserSchema.parse(value)),
  });

  return (
    <FormDialog
      title="Add user"
      description="Create an account and share the temporary password securely."
      formId={FORM_ID}
      submitLabel="Create user"
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
                  <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                  <Input
                    id={field.name}
                    type="text"
                    placeholder="Jane Doe"
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

          <form.Field
            name="email"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    type="email"
                    placeholder="name@school.id"
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="password"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Temporary password</FieldLabel>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <PasswordInput
                        id={field.name}
                        placeholder="********"
                        autoComplete="new-password"
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => field.handleChange(generatePassword())}
                    >
                      Generate
                    </Button>
                  </div>
                  <FieldDescription>
                    Use the eye icon to reveal it before sharing. It isn't shown again.
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
