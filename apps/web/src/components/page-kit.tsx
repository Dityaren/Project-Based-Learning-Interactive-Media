import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { MotionConfig, motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 32 } },
};

export function Page({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6"
      >
        <motion.div variants={item}>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </motion.div>
        {children}
      </motion.div>
    </MotionConfig>
  );
}

export const Grid = ({ cols = 4, children }: { cols?: 3 | 4; children: ReactNode }) => (
  <div className={`grid gap-4 sm:grid-cols-2 ${cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
    {children}
  </div>
);

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
}) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -2 }}
      className="rounded-xl border bg-card p-4 shadow-xs"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </motion.div>
  );
}

export function Panel({
  title,
  action,
  className = "",
  children,
}: {
  title: string;
  action?: { label: string; to: string };
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.section variants={item} className={`rounded-xl border bg-card shadow-xs ${className}`}>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        {action && (
          <Link
            to={action.to as never}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {action.label} <ArrowRight className="size-3" />
          </Link>
        )}
      </div>
      <div className="p-4">{children}</div>
    </motion.section>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
      />
    </div>
  );
}

const tones = {
  ok: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  soon: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  late: "bg-red-500/15 text-red-700 dark:text-red-400",
  info: "bg-primary/10 text-primary",
};
export const Pill = ({
  tone = "info",
  children,
}: {
  tone?: keyof typeof tones;
  children: ReactNode;
}) => (
  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
    {children}
  </span>
);

export const Empty = ({ children }: { children: ReactNode }) => (
  <p className="py-6 text-center text-sm text-muted-foreground">{children}</p>
);

export const Row = ({ children }: { children: ReactNode }) => (
  <li className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
    {children}
  </li>
);
