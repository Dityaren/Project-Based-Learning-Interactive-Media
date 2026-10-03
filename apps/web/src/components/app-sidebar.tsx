import { can } from "@repo/auth/permissions";
import { useAuthSuspense } from "@repo/auth/tanstack/hooks";
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
import { TooltipProvider } from "@repo/ui/components/tooltip";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { MotionConfig, motion, type Variants } from "motion/react";
import { useMemo } from "react";

import { SidebarSignOutButton } from "#/components/sidebar-sign-out-button";
import { navGroups, roleLabel } from "#/features/nav/items";

const spring = { type: "spring", stiffness: 500, damping: 38 } as const;

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } },
};
const rowVariants: Variants = {
  hidden: { opacity: 0, x: 16 },
  show: { opacity: 1, x: 0, transition: spring },
};

const pressVariants: Variants = {
  rest: { x: 0, scale: 1 },
  hover: { x: -3 },
  tap: { scale: 0.97 },
};
const iconVariants: Variants = {
  rest: { rotate: 0, scale: 1 },
  hover: { rotate: -8, scale: 1.15 },
};

const tip = (label: string) => ({
  children: label,
  side: "left" as const,
  sideOffset: 10,
});

export function AppSidebar() {
  const { user } = useAuthSuspense();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const groups = useMemo(
    () =>
      navGroups
        .map((g) => ({
          ...g,
          items: g.items.filter(
            (i) => (!i.devOnly || import.meta.env.DEV) && (!i.needs || can(user?.role, i.needs)),
          ),
        }))
        .filter((g) => g.items.length > 0),
    [user?.role],
  );

  const isActive = (url: string) =>
    url === "/app" ? pathname === "/app" : pathname === url || pathname.startsWith(`${url}/`);

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delay={0} closeDelay={0}>
        <Sidebar side="right" variant="floating" collapsible="icon">
          <SidebarHeader className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <motion.div
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  transition={spring}
                >
                  <SidebarMenuButton
                    size="lg"
                    tooltip={tip(`${user?.name ?? "Account"} · ${user?.email ?? ""}`)}
                    render={<Link to="/app/profile" />}
                    className="h-auto rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-3 ring-1 ring-primary/10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:bg-none group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:ring-0"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-sm leading-none font-semibold text-primary ring-2 ring-primary/20 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:text-xs">
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="size-full object-cover"
                        />
                      ) : (
                        getInitials(user?.name)
                      )}
                    </div>

                    <div className="grid min-w-0 flex-1 gap-0.5 text-left leading-tight group-data-[collapsible=icon]:hidden">
                      <span className="truncate text-sm font-semibold">
                        {user?.name ?? "Account"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                      <span className="mt-1 w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-primary uppercase">
                        {roleLabel[user?.role ?? ""] ?? "User"}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </motion.div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent className="px-2">
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-3"
            >
              {groups.map((group) => (
                <SidebarGroup key={group.label} className="p-0">
                  <SidebarGroupLabel className="px-2 text-[11px] tracking-wider text-muted-foreground/70 uppercase group-data-[collapsible=icon]:hidden">
                    {group.label}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="gap-1">
                      {group.items.map((item) => {
                        const active = isActive(item.url);
                        return (
                          <SidebarMenuItem key={item.url}>
                            <motion.div variants={rowVariants}>
                              <motion.div
                                variants={pressVariants}
                                initial="rest"
                                animate="rest"
                                whileHover="hover"
                                whileTap="tap"
                                transition={spring}
                              >
                                <SidebarMenuButton
                                  tooltip={item.title}
                                  render={<Link to={item.url} />}
                                  aria-current={active ? "page" : undefined}
                                  className="relative h-9 rounded-lg hover:bg-transparent data-[active=true]:bg-transparent"
                                >
                                  {active && (
                                    <>
                                      <motion.span
                                        layoutId="nav-pill"
                                        transition={spring}
                                        className="absolute inset-0 rounded-lg bg-primary/10 ring-1 ring-primary/15"
                                      />
                                      <motion.span
                                        layoutId="nav-bar"
                                        transition={spring}
                                        className="absolute top-1/2 right-0 h-5 w-1 -translate-y-1/2 rounded-l-full bg-primary"
                                      />
                                    </>
                                  )}

                                  <motion.span
                                    variants={iconVariants}
                                    className="relative z-10 flex"
                                  >
                                    <item.icon
                                      className={active ? "size-4 text-primary" : "size-4"}
                                    />
                                  </motion.span>
                                  <span
                                    className={`relative z-10 ${active ? "font-medium text-foreground" : "text-muted-foreground"}`}
                                  >
                                    {item.title}
                                  </span>
                                </SidebarMenuButton>
                              </motion.div>
                            </motion.div>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </motion.div>
          </SidebarContent>

          <SidebarFooter className="gap-1 p-2">
            <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:justify-center">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <BookOpen className="size-3.5" />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
                ProjectLearn · PjBL Media
              </span>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarSignOutButton />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>
      </TooltipProvider>
    </MotionConfig>
  );
}

function getInitials(name?: string | null) {
  if (!name) return "U";
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase() || "U"
  );
}
