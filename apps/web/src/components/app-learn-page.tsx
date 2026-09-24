import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Code2,
  Database,
  Globe,
  Layers3,
  PlayCircle,
  Search,
} from "lucide-react";

const courses = [
  {
    title: "HTML & CSS Fundamentals",
    description: "Learn the fundamentals of building structured and responsive web pages.",
    category: "Web Development",
    lessons: 12,
    duration: "4 hours",
    progress: 82,
    icon: Globe,
  },
  {
    title: "JavaScript Basics",
    description:
      "Understand variables, functions, conditions, loops, arrays, and basic DOM manipulation.",
    category: "Programming",
    lessons: 16,
    duration: "6 hours",
    progress: 64,
    icon: Code2,
  },
  {
    title: "Database Fundamentals",
    description: "Learn relational databases, SQL, tables, relationships, and CRUD operations.",
    category: "Database",
    lessons: 14,
    duration: "5 hours",
    progress: 38,
    icon: Database,
  },
  {
    title: "Web Application Development",
    description: "Build complete web applications by combining frontend and backend concepts.",
    category: "Web Development",
    lessons: 20,
    duration: "8 hours",
    progress: 0,
    icon: Layers3,
  },
];

const categories = [
  {
    title: "Web Development",
    description: "HTML, CSS, JavaScript, and modern web development.",
    count: 8,
    icon: Globe,
  },
  {
    title: "Programming",
    description: "Programming fundamentals and problem solving.",
    count: 6,
    icon: Code2,
  },
  {
    title: "Database",
    description: "SQL, relational databases, and data management.",
    count: 5,
    icon: Database,
  },
];

export function LearnPage() {
  return (
    <main className="flex-1 space-y-8 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Learn</h1>
        <p className="text-muted-foreground">
          Explore lessons and continue building your programming skills.
        </p>
      </div>

      <section className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm md:p-8">
        <div className="max-w-2xl">
          <span className="text-sm font-medium text-primary">Continue learning</span>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight">JavaScript Basics</h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Continue learning JavaScript fundamentals and practice your programming logic through
            interactive lessons.
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <PlayCircle className="size-4" />
              Continue Learning
            </button>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>64% complete</span>
              <span>10 of 16 lessons</span>
            </div>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: "64%" }} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold">Explore Learning Materials</h2>
            <p className="text-sm text-muted-foreground">
              Find lessons and courses based on your learning goals.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search lessons..."
              className="h-10 w-full rounded-md border bg-background pr-4 pl-9 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {courses.map((course) => (
            <CourseCard key={course.title} course={course} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-semibold">Browse by Category</h2>
          <p className="text-sm text-muted-foreground">Explore learning materials by subject.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.title} category={category} />
          ))}
        </div>
      </section>
    </main>
  );
}

function CourseCard({ course }: { course: (typeof courses)[number] }) {
  const Icon = course.icon;
  const completed = course.progress === 100;
  const started = course.progress > 0;

  return (
    <article className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-5" />
        </div>

        {completed ? (
          <CheckCircle2 className="size-5 text-primary" />
        ) : started ? (
          <span className="text-xs font-medium text-primary">{course.progress}% complete</span>
        ) : (
          <span className="text-xs text-muted-foreground">Not started</span>
        )}
      </div>

      <div className="mt-5">
        <span className="text-xs font-medium text-muted-foreground">{course.category}</span>

        <h3 className="mt-1 font-semibold">{course.title}</h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">{course.description}</p>
      </div>

      <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <BookOpen className="size-3.5" />
          {course.lessons} lessons
        </span>

        <span className="flex items-center gap-1.5">
          <Clock3 className="size-3.5" />
          {course.duration}
        </span>
      </div>

      <div className="mt-5">
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        className="mt-5 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border text-sm font-medium hover:bg-muted"
      >
        {started ? "Continue" : "Start Learning"}
        <ArrowRight className="size-4" />
      </button>
    </article>
  );
}

function CategoryCard({ category }: { category: (typeof categories)[number] }) {
  const Icon = category.icon;

  return (
    <button
      type="button"
      className="group rounded-xl border bg-card p-5 text-left text-card-foreground shadow-sm transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-5" />
        </div>

        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>

      <h3 className="mt-5 font-semibold">{category.title}</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.description}</p>

      <p className="mt-4 text-xs font-medium text-muted-foreground">
        {category.count} learning materials
      </p>
    </button>
  );
}
