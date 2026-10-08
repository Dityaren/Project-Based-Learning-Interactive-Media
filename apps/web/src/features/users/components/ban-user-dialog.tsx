import { Input } from "@repo/ui/components/input";
import { useState } from "react";

import { FormDialog } from "#/components/form-dialog";
import { FormField } from "#/components/form-field";

import type { UserRow } from "../types";
import { useUserMutation } from "../use-user-mutation";
import { setUserBan } from "../users.functions";

export function BanUserDialog({ row, onClose }: { row: UserRow; onClose: () => void }) {
  const m = useUserMutation(setUserBan, {
    onDone: onClose,
    success: (_, v) => (v.banned ? "Account deactivated" : "Account reactivated"),
  });
  const [reason, setReason] = useState("");
  const banning = !row.banned;

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
      submitLabel={banning ? "Deactivate" : "Reactivate"}
      destructive={banning}
      pending={m.isPending}
      error={m.error?.message}
      onSubmit={() =>
        m.mutate({ userId: row.id, banned: banning, reason: reason.trim() || undefined })
      }
      onClose={onClose}
    >
      {banning && (
        <FormField label="Reason (optional)" htmlFor="reason">
          <Input
            id="reason"
            value={reason}
            maxLength={200}
            onChange={(e) => setReason(e.target.value)}
          />
        </FormField>
      )}
    </FormDialog>
  );
}
