// components/status-badge.tsx
import { Badge } from "@repo/ui/components/badge";
import type { ReactNode } from "react";

const TONES = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-primary/10 text-primary",
  success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  warning: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  danger: "bg-red-500/15 text-red-700 dark:text-red-400",
  violet: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
} as const;

export type Tone = keyof typeof TONES;

export function StatusBadge({
  tone = "neutral",
  title,
  children,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}) {
  return (
    <Badge variant="secondary" title={title} className={`border-transparent ${TONES[tone]}`}>
      {children}
    </Badge>
  );
}
