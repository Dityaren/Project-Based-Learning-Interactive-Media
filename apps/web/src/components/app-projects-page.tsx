import {
  ArrowUpRight,
  CalendarDays,
  FolderKanban,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";

const projects = [
  {
    title: "Interactive Web Portfolio",
    description: "Build a responsive personal portfolio using HTML, CSS, and JavaScript.",
    category: "Web Programming",
    status: "In Progress",
    progress: 75,
    deadline: "Oct 12, 2026",
  },
  {
    title: "Student Management System",
    description: "Create a web-based application for managing student information and records.",
    category: "Web Programming",
    status: "In Progress",
    progress: 45,
    deadline: "Oct 20, 2026",
  },
  {
    title: "Personal Landing Page",
    description: "Design and develop a simple landing page using modern web technologies.",
    category: "Web Programming",
    status: "Completed",
    progress: 100,
    deadline: "Sep 18, 2026",
  },
  {
    title: "Database Management App",
    description:
      "Develop an application that demonstrates CRUD operations with a relational database.",
    category: "Database",
    status: "Not Started",
    progress: 0,
    deadline: "Nov 2, 2026",
  },
  {
    title: "JavaScript Quiz Application",
    description: "Develop an interactive quiz application with scoring and question management.",
    category: "Programming",
    status: "In Progress",
    progress: 60,
    deadline: "Oct 28, 2026",
  },
  {
    title: "Responsive School Website",
    description: "Create a responsive school website with multiple pages and reusable components.",
    category: "Web Programming",
    status: "Completed",
    progress: 100,
    deadline: "Sep 10, 2026",
  },
];

export function ProjectsPage() {
  return (
    <main className="flex-1 space-y-8 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and continue your learning projects.</p>
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" />
          New Project
        </button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search projects..."
            className="h-10 w-full rounded-md border bg-background pr-4 pl-9 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
          />
        </div>

        <select className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring">
          <option>All projects</option>
          <option>In Progress</option>
          <option>Not Started</option>
          <option>Completed</option>
        </select>

        <select className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring">
          <option>All categories</option>
          <option>Web Programming</option>
          <option>Programming</option>
          <option>Database</option>
        </select>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </main>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <article className="group flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between p-5 pb-0">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          <FolderKanban className="size-5" />
        </div>

        <button
          type="button"
          aria-label={`More options for ${project.title}`}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
            {project.category}
          </span>

          <StatusBadge status={project.status} />
        </div>

        <h2 className="font-semibold tracking-tight">{project.title}</h2>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />
          <span>Deadline {project.deadline}</span>
        </div>

        <button
          type="button"
          className="mt-6 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors hover:bg-muted"
        >
          Open Project
          <ArrowUpRight className="size-4" />
        </button>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "Completed"
      ? "bg-muted text-foreground"
      : status === "In Progress"
        ? "bg-primary/10 text-primary"
        : "bg-muted text-muted-foreground";

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>{status}</span>
  );
}
