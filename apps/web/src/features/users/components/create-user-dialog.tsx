import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { useState } from "react";

import { FormDialog } from "#/components/form-dialog";
import { FormField } from "#/components/form-field";
import { SelectField } from "#/components/select-field";

import { ROLE_LABEL, type Role } from "../constants";
import { createUserSchema } from "../schemas";
import { useUserMutation } from "../use-user-mutation";
import { createUser } from "../users.functions";

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
  const m = useUserMutation(createUser, onClose);
  const [form, setForm] = useState({ name: "", email: "", role: "student" as Role, password: "" });
  const [localError, setLocalError] = useState<string | null>(null);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    const parsed = createUserSchema.safeParse(form);
    if (!parsed.success) return setLocalError(parsed.error.issues[0]?.message ?? "Invalid input");
    setLocalError(null);
    m.mutate(parsed.data);
  };

  return (
    <FormDialog
      title="Add user"
      description="Create an account and share the temporary password securely."
      submitLabel="Create user"
      pending={m.isPending}
      error={localError ?? m.error?.message}
      onSubmit={submit}
      onClose={onClose}
    >
      <FormField label="Full name" htmlFor="name">
        <Input
          id="name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          autoFocus
        />
      </FormField>
      <FormField label="Email" htmlFor="email">
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />
      </FormField>
      <FormField label="Role" htmlFor="role">
        <SelectField
          id="role"
          value={form.role}
          onChange={(v) => set("role", v as Role)}
          options={assignable.map((r) => ({ value: r, label: ROLE_LABEL[r] }))}
        />
      </FormField>
      <FormField
        label="Temporary password"
        htmlFor="password"
        hint="Only shown here. Share it securely."
      >
        <div className="flex gap-2">
          <Input
            id="password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            className="font-mono"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => set("password", generatePassword())}
          >
            Generate
          </Button>
        </div>
      </FormField>
    </FormDialog>
  );
}
