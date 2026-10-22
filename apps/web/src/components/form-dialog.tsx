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
  onClose: () => void;
  children?: ReactNode;
} & ({ formId: string; onSubmit?: never } | { formId?: undefined; onSubmit: () => void });

export function FormDialog(props: Props) {
  const {
    title,
    description,
    submitLabel,
    destructive,
    pending,
    error,
    onClose,
    children,
    formId,
    onSubmit,
  } = props;

  const content = (
    <>
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
          form={formId}
          variant={destructive ? "destructive" : "default"}
          disabled={pending}
        >
          {pending ? "Working…" : submitLabel}
        </Button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog open onOpenChange={(open) => !open && !pending && onClose()}>
      <DialogContent className="sm:max-w-md">
        {formId ? (
          <div className="grid gap-4">{content}</div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit?.();
            }}
            className="grid gap-4"
          >
            {content}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
