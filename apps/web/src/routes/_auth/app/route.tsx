import { SidebarInset, SidebarProvider, SidebarTrigger } from "@repo/ui/components/sidebar";
import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { Fragment } from "react";

import { AppSidebar } from "#/components/app-sidebar.tsx";
import { ThemeToggle } from "#/components/theme-toggle.tsx";
import { navGroups } from "#/features/nav/items";

export const Route = createFileRoute("/_auth/app")({
  component: AppLayout,
});

const titles = new Map(navGroups.flatMap((g) => g.items).map((i) => [i.url, i.title]));

const humanize = (seg: string) =>
  /^[0-9a-f-]{8,}$/i.test(seg) || /^\d+$/.test(seg)
    ? "Details"
    : seg.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

function useCrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const parts = pathname.split("/").filter(Boolean);
  return parts.map((seg, i) => {
    const url = "/" + parts.slice(0, i + 1).join("/");
    return { url, label: titles.get(url) ?? humanize(seg), linkable: titles.has(url) };
  });
}

function AppLayout() {
  const crumbs = useCrumbs();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
          <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
            <ol className="flex items-center gap-1.5 text-sm">
              {crumbs.map((c, i) => {
                const last = i === crumbs.length - 1;
                return (
                  <Fragment key={c.url}>
                    {i > 0 && (
                      <ChevronRight
                        className={`size-3.5 shrink-0 text-muted-foreground/60 ${last ? "" : "hidden sm:block"}`}
                      />
                    )}
                    <li className={`min-w-0 ${last ? "" : "hidden sm:block"}`}>
                      {last ? (
                        <span aria-current="page" className="truncate font-semibold">
                          {c.label}
                        </span>
                      ) : c.linkable ? (
                        <Link
                          to={c.url}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {c.label}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">{c.label}</span>
                      )}
                    </li>
                  </Fragment>
                );
              })}
            </ol>
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            {/* notification bell should goes here later wahahahaa */}
            <ThemeToggle />
            <div className="mx-1 h-5 w-px bg-border" />
            <SidebarTrigger />
          </div>
        </header>

        <main className="flex flex-1 flex-col">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-6"
          >
            <Outlet />
          </motion.div>
        </main>

        <footer className="flex flex-col items-center justify-between gap-1 border-t px-4 py-3 text-xs text-muted-foreground sm:flex-row md:px-6">
          <p>© {new Date().getFullYear()} Dityaren. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>ProjectLearn · PjBL Media</span>
            {import.meta.env.DEV && (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-medium text-amber-600 dark:text-amber-400">
                dev
              </span>
            )}
          </p>
        </footer>
      </SidebarInset>
      <AppSidebar />
    </SidebarProvider>
  );
}
