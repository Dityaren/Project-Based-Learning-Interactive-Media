import { authClient } from "@repo/auth/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@repo/ui/components/sidebar";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { BookOpen, FolderKanban, Gauge, Settings, User } from "lucide-react";

import { SidebarSignOutButton } from "#/components/sidebar-sign-out-button";
type User = typeof authClient.$Infer.Session.user;

const navigation = [
  {
    title: "Dashboard",
    url: "/app",
    icon: Gauge,
  },
  {
    title: "Projects",
    url: "/app/projects",
    icon: FolderKanban,
  },
  {
    title: "Learn",
    url: "/app/learn",
    icon: BookOpen,
  },
];

const account = [
  {
    title: "Profile",
    url: "/app/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/app/settings",
    icon: Settings,
  },
];

export function AppSidebar({ userData: user }: { userData: User }) {
  const navigate = useNavigate();

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isActive = (url: string) => {
    if (url === "/app") {
      return pathname === "/app";
    }

    return pathname.startsWith(url);
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="ProjectLearn"
              onClick={() => navigate({ to: "/app" })}
              className="rounded-lg"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="size-4" />
              </div>

              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">ProjectLearn</span>
                <span className="truncate text-xs text-muted-foreground">PjBL Media</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-2 text-xs text-muted-foreground">
            Workspace
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navigation.map((item) => {
                const active = isActive(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={active}
                      onClick={() => navigate({ to: item.url })}
                      className="relative h-9 rounded-lg"
                    >
                      <span
                        className={[
                          "absolute left-0 top-1/2 z-10 h-5 w-0.5 -translate-y-1/2 rounded-full bg-black transition-transform duration-200 dark:bg-white",
                          active ? "scale-y-100" : "scale-y-0",
                        ].join(" ")}
                      />

                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4 p-0">
          <SidebarGroupLabel className="px-2 text-xs text-muted-foreground">
            Account
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {account.map((item) => {
                const active = isActive(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={active}
                      onClick={() => navigate({ to: item.url })}
                      className="relative h-9 rounded-lg"
                    >
                      <span
                        className={[
                          "absolute left-0 top-1/2 z-10 h-5 w-0.5 -translate-y-1/2 rounded-full bg-black transition-transform duration-200 dark:bg-white",
                          active ? "scale-y-100" : "scale-y-0",
                        ].join(" ")}
                      />

                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={user?.name ?? "Account"}
              onClick={() => navigate({ to: "/app/profile" })}
              className="h-12 rounded-lg"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {user.image ? (
                  <img src={user.image} className="rounded-full object-cover" />
                ) : (
                  getInitials(user.name)
                )}
              </div>

              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name ?? "Student"}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email ?? "Student account"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarSignOutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function getInitials(name?: string | null) {
  if (!name) {
    return "S";
  }

  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "S"
  );
}
