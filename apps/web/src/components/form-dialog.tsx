import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: ReactNode;
  submitLabel: string;
  destructive?: boolean;
  pending?: boolean;
  error?: string | null;
  onSubmit: () => void;
  onClose: () => void;
  children?: ReactNode;
};

export function FormDialog({
  title,
  description,
  submitLabel,
  destructive,
  pending,
  error,
  onSubmit,
  onClose,
  children,
}: Props) {
  return (
    <Dialog open onOpenChange={(open) => !open && !pending && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="grid gap-4"
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>

          {children}

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={destructive ? "destructive" : "default"}
              disabled={pending}
            >
              {pending ? "Working…" : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
