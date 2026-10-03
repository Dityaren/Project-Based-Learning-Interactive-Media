export type ProjectStatus = "draft" | "active" | "completed";
export type ViewStatus = ProjectStatus | "overdue";

export type Project = {
  id: string;
  title: string;
  subject: string;
  className: string;
  teacher: string;
  status: ProjectStatus;
  progress: number;
  dueAt: string; // ISO
  teamMode: "individual" | "team";
  members: number;
  milestonesDone: number;
  milestonesTotal: number;
  pendingReviews: number; // teacher view
};

const day = 86_400_000;
const inDays = (n: number) => new Date(Date.now() + n * day).toISOString();

const all: Project[] = [
  {
    id: "p1",
    title: "Renewable Energy Prototype",
    subject: "Physics",
    className: "X-A",
    teacher: "Ms. Rahma",
    status: "active",
    progress: 72,
    dueAt: inDays(11),
    teamMode: "team",
    members: 4,
    milestonesDone: 3,
    milestonesTotal: 5,
    pendingReviews: 3,
  },
  {
    id: "p2",
    title: "Community Health Survey",
    subject: "Biology",
    className: "XI-A",
    teacher: "Mr. Budi",
    status: "active",
    progress: 45,
    dueAt: inDays(18),
    teamMode: "team",
    members: 3,
    milestonesDone: 2,
    milestonesTotal: 5,
    pendingReviews: 2,
  },
  {
    id: "p3",
    title: "Digital Storytelling",
    subject: "Language Arts",
    className: "X-B",
    teacher: "Ms. Sari",
    status: "active",
    progress: 18,
    dueAt: inDays(30),
    teamMode: "individual",
    members: 1,
    milestonesDone: 1,
    milestonesTotal: 6,
    pendingReviews: 5,
  },
  {
    id: "p4",
    title: "Local History Documentary",
    subject: "History",
    className: "XI-B",
    teacher: "Mr. Andi",
    status: "active",
    progress: 60,
    dueAt: inDays(-3),
    teamMode: "team",
    members: 5,
    milestonesDone: 3,
    milestonesTotal: 5,
    pendingReviews: 4,
  },
  {
    id: "p5",
    title: "Water Quality Investigation",
    subject: "Chemistry",
    className: "X-A",
    teacher: "Ms. Rahma",
    status: "completed",
    progress: 100,
    dueAt: inDays(-20),
    teamMode: "team",
    members: 4,
    milestonesDone: 4,
    milestonesTotal: 4,
    pendingReviews: 0,
  },
  {
    id: "p6",
    title: "Budgeting App Design",
    subject: "Mathematics",
    className: "XI-A",
    teacher: "Mr. Budi",
    status: "draft",
    progress: 0,
    dueAt: inDays(45),
    teamMode: "individual",
    members: 0,
    milestonesDone: 0,
    milestonesTotal: 4,
    pendingReviews: 0,
  },
];

export function getProjects(role?: string | null): Project[] {
  return role === "teacher" ? all : all.filter((p) => p.status !== "draft");
}

export function viewStatus(p: Project): ViewStatus {
  if (p.status === "active" && new Date(p.dueAt).getTime() < Date.now()) return "overdue";
  return p.status;
}

export function dueLabel(p: Project) {
  if (p.status === "completed") return "Completed";
  const days = Math.ceil((new Date(p.dueAt).getTime() - Date.now()) / day);
  if (days < 0) return `Overdue by ${-days}d`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `${days} days left`;
}

export const statusMeta: Record<ViewStatus, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-muted text-muted-foreground" },
  active: { label: "Active", cls: "bg-primary/10 text-primary" },
  overdue: { label: "Overdue", cls: "bg-red-500/15 text-red-700 dark:text-red-400" },
  completed: {
    label: "Completed",
    cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  },
};
