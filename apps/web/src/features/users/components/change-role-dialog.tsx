import { useState } from "react";

import { FormDialog } from "#/components/form-dialog";
import { FormField } from "#/components/form-field";
import { SelectField } from "#/components/select-field";

import { ROLE_LABEL, type Role } from "../constants";
import type { UserRow } from "../types";
import { useUserMutation } from "../use-user-mutation";
import { setUserRole } from "../users.functions";

export function ChangeRoleDialog({
  row,
  assignable,
  onClose,
}: {
  row: UserRow;
  assignable: readonly Role[];
  onClose: () => void;
}) {
  const m = useUserMutation(setUserRole, onClose);
  const [role, setRole] = useState<Role>((row.role ?? "student") as Role);

  return (
    <FormDialog
      title="Change role"
      description={
        <>
          Update the role for <b className="text-foreground">{row.email}</b>.
        </>
      }
      submitLabel="Save role"
      pending={m.isPending}
      error={m.error?.message}
      onSubmit={() => m.mutate({ userId: row.id, role })}
      onClose={onClose}
    >
      <FormField label="Role" htmlFor="role">
        <SelectField
          id="role"
          value={role}
          onChange={(v) => setRole(v as Role)}
          options={assignable.map((r) => ({ value: r, label: ROLE_LABEL[r] }))}
        />
      </FormField>
    </FormDialog>
  );
}
