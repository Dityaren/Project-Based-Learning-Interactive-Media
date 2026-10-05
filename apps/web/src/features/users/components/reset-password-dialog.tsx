import { Input } from "@repo/ui/components/input";
import { useState } from "react";

import { FormDialog } from "#/components/form-dialog";
import { FormField } from "#/components/form-field";

import { setPasswordSchema } from "../schemas";
import type { UserRow } from "../types";
import { useUserMutation } from "../use-user-mutation";
import { setUserPassword } from "../users.functions";

export function ResetPasswordDialog({ row, onClose }: { row: UserRow; onClose: () => void }) {
  const m = useUserMutation(setUserPassword, onClose);
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = () => {
    const parsed = setPasswordSchema.safeParse({ userId: row.id, password });
    if (!parsed.success) return setLocalError("Password must be at least 8 characters");
    setLocalError(null);
    m.mutate(parsed.data);
  };

  return (
    <FormDialog
      title="Reset password"
      description={
        <>
          Set a new password for <b className="text-foreground">{row.email}</b>.
        </>
      }
      submitLabel="Set password"
      pending={m.isPending}
      error={localError ?? m.error?.message}
      onSubmit={submit}
      onClose={onClose}
    >
      <FormField label="New password" htmlFor="password">
        <Input
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="font-mono"
          autoFocus
        />
      </FormField>
    </FormDialog>
  );
}
