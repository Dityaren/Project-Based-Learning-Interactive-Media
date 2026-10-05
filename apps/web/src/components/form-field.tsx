import { Label } from "@repo/ui/components/label";
import type { ReactNode } from "react";

type Props = { label: string; htmlFor?: string; hint?: ReactNode; children: ReactNode };

export function FormField({ label, htmlFor, hint, children }: Props) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
