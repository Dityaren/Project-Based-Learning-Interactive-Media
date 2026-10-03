import type { Permissions } from "@repo/auth/permissions";
import {
  BadgeInfo,
  BookOpen,
  CalendarRange,
  FolderKanban,
  Gauge,
  GraduationCap,
  Library,
  Megaphone,
  MessagesSquare,
  ScrollText,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  User,
  Users,
  ClipboardCheck,
  ListChecks,
  School,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  needs?: Permissions;
  devOnly?: boolean;
};

export type NavGroup = { label: string; items: NavItem[] };

export const navGroups: NavGroup[] = [
  {
    label: "Learning",
    items: [
      { title: "Dashboard", url: "/app", icon: Gauge },
      { title: "Projects", url: "/app/projects", icon: FolderKanban, needs: { project: ["read"] } },
      { title: "Learn", url: "/app/learn", icon: BookOpen, needs: { material: ["read"] } },
      {
        title: "My Grades",
        url: "/app/grades",
        icon: GraduationCap,
        needs: { submission: ["create"] },
      },
      {
        title: "Discussions",
        url: "/app/discussions",
        icon: MessagesSquare,
        needs: { discussion: ["participate"] },
      },
      {
        title: "Announcements",
        url: "/app/announcements",
        icon: Megaphone,
        needs: { announcement: ["read"] },
      },
    ],
  },
  {
    label: "Teaching",
    items: [
      {
        title: "Submissions",
        url: "/app/submissions",
        icon: ClipboardCheck,
        needs: { submission: ["review"] },
      },
      { title: "Rubrics", url: "/app/rubrics", icon: ListChecks, needs: { rubric: ["manage"] } },
      { title: "Classes", url: "/app/classes", icon: School, needs: { class: ["manage"] } },
    ],
  },
  {
    label: "Administration",
    items: [
      { title: "Users", url: "/app/admin/users", icon: Users, needs: { user: ["list"] } },
      {
        title: "Academic Years",
        url: "/app/admin/academic-years",
        icon: CalendarRange,
        needs: { academic: ["manage"] },
      },
      {
        title: "Subjects",
        url: "/app/admin/subjects",
        icon: Library,
        needs: { academic: ["manage"] },
      },
      {
        title: "Audit Logs",
        url: "/app/admin/audit-logs",
        icon: ScrollText,
        needs: { audit: ["read"] },
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "Roles & Permissions",
        url: "/app/master/roles",
        icon: ShieldCheck,
        needs: { system: ["manage-roles"] },
      },
      {
        title: "Configuration",
        url: "/app/master/config",
        icon: SlidersHorizontal,
        needs: { system: ["configure"] },
      },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Profile", url: "/app/profile", icon: User },
      { title: "Settings", url: "/app/settings", icon: Settings },
    ],
  },
  {
    label: "Dev",
    items: [{ title: "Test", url: "/app/test", icon: BadgeInfo, devOnly: true }],
  },
];

export const roleLabel: Record<string, string> = {
  student: "Student",
  teacher: "Teacher",
  admin: "Admin",
  master: "Master",
};
