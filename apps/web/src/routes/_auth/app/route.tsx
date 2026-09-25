import { SidebarInset, SidebarProvider, SidebarTrigger } from "@repo/ui/components/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AppSidebar } from "#/components/app-sidebar.tsx";
import { ThemeToggle } from "#/components/theme-toggle.tsx";

export const Route = createFileRoute("/_auth/app")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex flex-1 flex-col p-4">
          <div className="w-full flex-1 rounded-md border p-2">
            <Outlet />
          </div>
        </main>

        <footer className="flex items-center justify-center p-3">
          Copyright (c) 2026 Dityaren. All Rights Reserved.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
