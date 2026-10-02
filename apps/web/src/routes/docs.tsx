// apps/web/src/routes/cheatsheet.tsx  ->  /cheatsheet
// Self-contained: uses only React, TanStack Router and shadcn theme tokens
// (bg-background, text-foreground, text-muted-foreground, border, bg-muted).
import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useState, type ReactNode } from "react";

export const Route = createFileRoute("/docs")({ component: Cheatsheet });

/* ----------------------------- content model ----------------------------- */

type Block =
  | { t: "p"; text: string }
  | { t: "list"; items: string[] }
  | { t: "note"; kind: "warn" | "tip"; text: string }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "code"; title: string; code: string };

type Section = { id: string; title: string; summary: string; blocks: Block[] };
type Group = { label: string; sections: Section[] };

const GROUPS: Group[] = [
  {
    label: "Start here",
    sections: [
      {
        id: "overview",
        title: "Overview",
        summary: "What the template is and where things live.",
        blocks: [
          {
            t: "list",
            items: [
              "Stack: TanStack Start + Router + Query, Better Auth, Drizzle (Postgres), shadcn/ui + Base UI, Vite+ and Nitro.",
              "Packages use the `@repo/*` scope. The app owns routes, env vars and feature logic.",
              "Imports go one way: `apps/web` imports from packages, never the reverse.",
            ],
          },
          {
            t: "table",
            head: ["Path", "What lives there"],
            rows: [
              ["`apps/web`", "Start app: `src/routes`, `src/components`, `.env.schema`"],
              ["`packages/auth`", "Better Auth config (`auth.ts`) and `src/tanstack/*` helpers"],
              ["`packages/db`", "Drizzle schema (`src/schema/*`), Drizzle Kit, Postgres"],
              ["`packages/ui`", "shadcn primitives, utils, theme provider"],
              ["`packages/logger`", "Shared logging and structured errors"],
              ["`tools/tsconfig`", "Shared TypeScript config"],
              ["`.agents/`", "Conventions: data-flow, auth, database, testing"],
            ],
          },
        ],
      },
      {
        id: "setup",
        title: "Setup",
        summary: "From clone to running dev server.",
        blocks: [
          { t: "p", text: "Needs Node 24+, pnpm 12+ and the Vite+ CLI (`vp`)." },
          {
            t: "code",
            title: "Terminal",
            code: `pnpm create cove -t monorepo   # or "Use this template" on GitHub
vp install

# put values in apps/web/.env.local (see apps/web/.env.schema)
vpr env:load                   # validate env

vpr db generate                # create the first migration
vpr db migrate
vpr dev                        # http://localhost:3000

./dev.sh                       # optional: Postgres via Docker + dev servers`,
          },
        ],
      },
      {
        id: "commands",
        title: "Commands",
        summary: "Use `vpr`, the shorthand for `vp run`.",
        blocks: [
          {
            t: "table",
            head: ["Command", "Does"],
            rows: [
              ["`vpr dev`", "Dev server"],
              ["`vp run build`", "Production build (cached); use as deploy command"],
              ["`vpr check` / `lint` / `format`", "Oxlint and Oxfmt"],
              ["`vpr db generate` / `migrate`", "Drizzle Kit migrations"],
              ["`vpr auth:generate`", "Regenerate `auth.schema.ts` after editing `auth.ts`"],
              ["`vpr ui add <name>`", "shadcn CLI (lands in `packages/ui`)"],
              ["`vpr test` / `test:e2e`", "Vitest once / Playwright (builds first)"],
              ["`vpr deps`", "Selective dependency upgrade"],
              ["`vp env doctor`", "Diagnose toolchain problems"],
            ],
          },
          {
            t: "note",
            kind: "warn",
            text: "`vp dev` (built-in) and `vp run dev` (your script) can differ. Prefer `vpr`. Run `vp install` after every pull.",
          },
        ],
      },
    ],
  },
  {
    label: "Core concepts",
    sections: [
      {
        id: "env",
        title: "Environment variables",
        summary: "Varlock keeps one schema as the source of truth.",
        blocks: [
          {
            t: "list",
            items: [
              "`apps/web/.env.schema` is committed. `apps/web/.env.local` holds real values and is not.",
              "Add a variable: edit the schema, add the value locally, run `vpr env:load`.",
              "Never read `process.env`. Import `ENV` from `varlock/env`.",
              "Read secrets inside a server boundary, not at module scope of isomorphic code.",
            ],
          },
          {
            t: "code",
            title: "Reading a variable",
            code: `import { ENV } from "varlock/env";

const value = ENV.YOUR_VAR; // typed from .env.schema`,
          },
        ],
      },
      {
        id: "routes",
        title: "Routes and guards",
        summary: "Layout routes decide who can see a page.",
        blocks: [
          {
            t: "table",
            head: ["Location", "Purpose"],
            rows: [
              [
                "`routes/_auth/route.tsx`",
                "Signed-in only. Checks auth in `beforeLoad` via Query.",
              ],
              ["`routes/_guest/route.tsx`", "Guests only. Redirects signed-in users away."],
              ["`routes/foo.tsx`", "Public page"],
            ],
          },
          {
            t: "list",
            items: [
              "Put signed-in pages under `routes/_auth/`.",
              'Keep `defaultPreload: "intent"` and `defaultPreloadStaleTime: 0` in the router config.',
              "Wrap a layout's `<Outlet />` in its own `Suspense` so the shell stays on screen while children load.",
            ],
          },
          {
            t: "note",
            kind: "warn",
            text: "Route guards only control navigation. They never replace auth checks in server functions.",
          },
        ],
      },
    ],
  },
  {
    label: "Data",
    sections: [
      {
        id: "database",
        title: "Database",
        summary: "Drizzle schema in `packages/db`.",
        blocks: [
          {
            t: "list",
            items: [
              "Tables live in `packages/db/src/schema/`. Export each from the schema index.",
              "Use `text().$type<Union>()` instead of `pgEnum`.",
              "Flow: edit schema, `vpr db generate`, read the SQL, `vpr db migrate`.",
              "`auth.schema.ts` is generated. Never hand-edit it.",
            ],
          },
          {
            t: "code",
            title: "packages/db/src/schema/projects.ts",
            code: `import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth.schema"; // confirm the export name

export const projects = pgTable(
  "projects",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    description: text(),
    // Better Auth ids are strings: use text + a foreign key, not serial
    authorId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("projects_author_idx").on(t.authorId)],
);

export type ProjectInsert = typeof projects.$inferInsert;
export type ProjectSelect = typeof projects.$inferSelect;`,
          },
          {
            t: "note",
            kind: "tip",
            text: 'Column keys without names assume Drizzle\'s snake_case casing is configured. If not, pass names like `text("author_id")`.',
          },
        ],
      },
      {
        id: "server-functions",
        title: "Server functions",
        summary: "Typed RPC endpoints. Treat them like protected API routes.",
        blocks: [
          {
            t: "list",
            items: [
              "Prefix names with `$` and import them statically (`$getUser`).",
              "Always add `authMiddleware` to anything that needs a user, even under `_auth` routes.",
              "`authMiddleware` uses the cookie cache (default 5 min). Use `freshAuthMiddleware` for destructive or security-sensitive work.",
              "Read the user from `context.user`. Never trust a user id sent by the client.",
              'Don\'t call `fetch("/api/...")` in loaders. Call a server function.',
            ],
          },
          {
            t: "code",
            title: "Minimal protected function",
            code: `import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@repo/auth/tanstack/middleware"; // check exports

export const $getMe = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => context.user);`,
          },
        ],
      },
      {
        id: "fetching",
        title: "Fetching data",
        summary: "Get a list into the client with Query.",
        blocks: [
          {
            t: "p",
            text: "Define `queryOptions` once next to the server function and reuse it everywhere. Fetch in the component by default.",
          },
          {
            t: "code",
            title: "routes/_auth/projects.tsx",
            code: `import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { projectsQueryOptions } from "~/lib/projects"; // use your alias

export const Route = createFileRoute("/_auth/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const projectsQuery = useQuery(projectsQueryOptions());

  if (projectsQuery.isPending) return <ProjectsSkeleton />;
  if (projectsQuery.isError) return <ProjectsError />;

  return (
    <ul>
      {projectsQuery.data.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}`,
          },
          {
            t: "table",
            head: ["Need", "Do this"],
            rows: [
              ["Cleaner loading state", "`useSuspenseQuery` inside a `<Suspense>` boundary"],
              [
                "Warm data before render",
                "In the loader: `void context.queryClient.query(opts).catch(noop)`. Still read with `useQuery`.",
              ],
              [
                "Block render on data",
                "`await context.queryClient.query(opts)` in the loader. Don't use `useLoaderData`.",
              ],
              ["Large lists", "Paginate on the server and put the page in the `queryKey`"],
            ],
          },
        ],
      },
      {
        id: "mutations",
        title: "Mutations",
        summary: "Write to the cache from the server response.",
        blocks: [
          {
            t: "list",
            items: [
              "Use `useMutation` with a server function. Return the canonical row and write it into the exact cache.",
              "Invalidate only what you can't rebuild, such as lists whose order may change.",
              "Use `router.invalidate()` only when guards or redirects must re-run.",
              "Optimistic updates only for reversible changes, never for deletes or server-generated ids.",
            ],
          },
          {
            t: "code",
            title: "Create and update the cache",
            code: `const qc = useQueryClient();

const create = useMutation({
  mutationFn: (input: { name: string; description?: string }) =>
    $createProject({ data: input }),
  onSuccess: (project) =>
    qc.setQueryData(projectsQueryOptions().queryKey, (old = []) => [
      project,
      ...old,
    ]),
});`,
          },
        ],
      },
    ],
  },
  {
    label: "Auth",
    sections: [
      {
        id: "auth",
        title: "How auth fits together",
        summary: "Only the middleware is a security boundary.",
        blocks: [
          {
            t: "table",
            head: ["Layer", "Job", "Security?"],
            rows: [
              ["`_auth` / `_guest` routes", "Redirect during navigation", "No"],
              ["`useAuth*` hooks", "Read the user for rendering", "No"],
              ["`authMiddleware`", "Reject requests, inject `context.user`", "Yes"],
              ["`freshAuthMiddleware`", "Same, but skips the cookie cache", "Yes"],
            ],
          },
          {
            t: "list",
            items: [
              "Config: `packages/auth/src/auth.ts`. Helpers: `packages/auth/src/tanstack/*`.",
              "Change auth: edit `auth.ts`, `vpr auth:generate`, `vpr db generate`, `vpr db migrate`, add secrets to `.env.schema`.",
            ],
          },
        ],
      },
      {
        id: "auth-hooks",
        title: "useAuth vs useAuthSuspense",
        summary: "Same cached data, different loading behavior.",
        blocks: [
          {
            t: "note",
            kind: "warn",
            text: "Inferred from TanStack Query semantics and the repo docs, not read from `hooks.ts`. Confirm the returned shape in `packages/auth/src/tanstack/hooks.ts`.",
          },
          {
            t: "table",
            head: ["", "useAuth()", "useAuthSuspense()"],
            rows: [
              ["Built on", "`useQuery`", "`useSuspenseQuery`"],
              ["While loading", "`isPending`, no data", "Suspends to the nearest fallback"],
              ["On error", "`isError` for you to handle", "Throws to an error boundary"],
              ["Best for", "Navbar, user menu, public pages", "Sections only shown when signed in"],
            ],
          },
          {
            t: "code",
            title: "Both styles",
            code: `function UserMenu() {
  const auth = useAuth();
  if (auth.isPending) return <Skeleton className="size-8 rounded-full" />;
  if (!auth.data) return <SignInButton />;
  return <Avatar user={auth.data} />;
}

function Profile() {
  const { data: user } = useAuthSuspense(); // always defined
  return <h1>Hi {user.name}</h1>;
}
// <Suspense fallback={<ProfileSkeleton />}><Profile /></Suspense>`,
          },
        ],
      },
    ],
  },
  {
    label: "Guides",
    sections: [
      {
        id: "new-feature",
        title: "Add a new feature",
        summary: "The projects example, end to end.",
        blocks: [
          {
            t: "table",
            head: ["What", "Where"],
            rows: [
              ["Table", "`packages/db/src/schema/projects.ts`, exported from the schema index"],
              ["Server functions, `queryOptions`", "`apps/web/src/lib/projects.ts`"],
              ["Page", "`apps/web/src/routes/_auth/projects.tsx`"],
              ["Components", "`apps/web/src/components/`"],
              ["Shared UI primitives", "`vpr ui add ...` (lands in `packages/ui`)"],
              ["Auth config", "`packages/auth/src/auth.ts` only"],
            ],
          },
          {
            t: "list",
            items: [
              "1. Write the table, then `vpr db generate` and `vpr db migrate`.",
              "2. Write server functions and `projectsQueryOptions` with `authMiddleware`.",
              "3. Write the `_auth` page with `useQuery` and `useMutation`.",
              "4. Add components, then `vpr lint` and a narrow test.",
              "If `apps/web` doesn't depend on `@repo/db` and `@repo/auth`, add them as `workspace:*` and run `vp install`.",
            ],
          },
          {
            t: "code",
            title: "apps/web/src/lib/projects.ts",
            code: `import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@repo/db";                  // check packages/db exports
import { projects } from "@repo/db/schema";     // check the exact subpath
import {
  authMiddleware,
  freshAuthMiddleware,
} from "@repo/auth/tanstack/middleware";          // check exports

// Create: the author comes from the session, never from the client
export const $createProject = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((d: { name: string; description?: string }) => d)
  .handler(async ({ context, data }) => {
    const [project] = await db
      .insert(projects)
      .values({ ...data, authorId: context.user.id })
      .returning();
    return project;
  });

// Read: always scope to the current user
export const $getProjects = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) =>
    db
      .select()
      .from(projects)
      .where(eq(projects.authorId, context.user.id))
      .orderBy(desc(projects.createdAt)),
  );

// Update: match id AND owner
export const $updateProject = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((d: { id: number; name?: string; description?: string }) => d)
  .handler(async ({ context, data }) => {
    const { id, ...changes } = data;
    const [project] = await db
      .update(projects)
      .set(changes)
      .where(and(eq(projects.id, id), eq(projects.authorId, context.user.id)))
      .returning();
    return project;
  });

// Delete: destructive, so use the fresh-session middleware
export const $deleteProject = createServerFn({ method: "POST" })
  .middleware([freshAuthMiddleware])
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ context, data }) => {
    const [deleted] = await db
      .delete(projects)
      .where(and(eq(projects.id, data.id), eq(projects.authorId, context.user.id)))
      .returning({ id: projects.id });
    return deleted;
  });

export const projectsQueryOptions = () =>
  queryOptions({
    queryKey: ["projects"],
    queryFn: ({ signal }) => $getProjects({ signal }),
  });`,
          },
          {
            t: "note",
            kind: "warn",
            text: "Import paths, `.inputValidator(...)` and the `{ data: input }` call shape depend on your TanStack Start version. Add real validation (for example zod); type annotations don't check runtime input. The `lib/` folder is a suggestion: match what exists in `apps/web/src`.",
          },
        ],
      },
    ],
  },
  {
    label: "Reference",
    sections: [
      {
        id: "rules",
        title: "House rules",
        summary: "Conventions from AGENTS.md and `.agents/`.",
        blocks: [
          {
            t: "list",
            items: [
              "Prefer simple solutions. Add abstractions only for a concrete need.",
              "Validate at system boundaries: input, auth, external APIs, persistence.",
              "Prefer type inference. Comments explain why, not what.",
              "Icons: `lucide-react` with the `Icon` suffix; brands from `@icons-pack/react-simple-icons`.",
              "UI copy describes outcomes and next steps, not providers or internal states.",
              "Run `vpr lint` plus the narrowest relevant tests. Don't build after every change.",
              "Testing: Vitest for unit tests, Playwright for e2e (`.agents/testing.md`).",
              "Deploy: Nitro presets; build command `vp run build`.",
            ],
          },
          {
            t: "note",
            kind: "warn",
            text: "Much of the stack is beta or RC (TanStack Start, Devtools, Nitro v3, Drizzle v1, Vite+). Versions are pinned; expect breaking changes when upgrading.",
          },
        ],
      },
    ],
  },
];

const FLAT = GROUPS.flatMap((g) => g.sections);

/* ------------------------------ syntax color ----------------------------- */

const TOKEN =
  /(\/\/.*|#.*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(import|from|export|const|async|await|return|if|type|new|void)\b|(\$\w+|\buse[A-Z]\w+|\bvpr?\b|\bvpx\b)|\b(\d+)\b/g;
const COLORS = [
  "",
  "italic text-zinc-500",
  "text-emerald-300",
  "text-violet-300",
  "text-amber-300",
  "text-sky-300",
];

function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of code.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(code.slice(last, i));
    const group = m.findIndex((v, idx) => idx > 0 && v !== undefined);
    out.push(
      <span key={i} className={COLORS[group]}>
        {m[0]}
      </span>,
    );
    last = i + m[0].length;
  }
  out.push(code.slice(last));
  return out;
}

/* ------------------------------- components ------------------------------ */

function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, i) =>
        part.startsWith("`") ? (
          <code key={i} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">
            {part.slice(1, -1)}
          </code>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

function CodeBlock({
  title,
  code,
  startOpen,
}: {
  title: string;
  code: string;
  startOpen: boolean;
}) {
  const [open, setOpen] = useState(startOpen);
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n").length;

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm text-zinc-200 focus-visible:outline-2 focus-visible:outline-sky-400"
        >
          <span
            className={`inline-block text-zinc-500 transition-transform ${open ? "rotate-90" : ""}`}
          >
            {">"}
          </span>
          <span className="truncate font-mono">{title}</span>
          <span className="shrink-0 text-xs text-zinc-500">{lines} lines</span>
        </button>
        {open && (
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="shrink-0 rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      {open && (
        <pre className="overflow-x-auto border-t border-zinc-800 p-4 text-[13px] leading-relaxed text-zinc-100">
          <code className="font-mono">{highlight(code)}</code>
        </pre>
      )}
    </div>
  );
}

function BlockView({ block, startOpen }: { block: Block; startOpen: boolean }) {
  switch (block.t) {
    case "p":
      return (
        <p className="my-3 leading-7">
          <Inline text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul className="my-3 list-disc space-y-1.5 pl-5 leading-7 marker:text-muted-foreground">
          {block.items.map((item) => (
            <li key={item}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <div
          className={`my-4 rounded-md border-l-4 px-4 py-3 text-sm leading-6 ${
            block.kind === "warn"
              ? "border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200"
              : "border-sky-500 bg-sky-500/10 text-sky-900 dark:text-sky-200"
          }`}
        >
          <Inline text={block.text} />
        </div>
      );
    case "table":
      return (
        <div className="my-4 overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/60">
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} className="px-3 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-t align-top">
                  {row.map((cell, c) => (
                    <td key={c} className="px-3 py-2 leading-6">
                      <Inline text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "code":
      return <CodeBlock title={block.title} code={block.code} startOpen={startOpen} />;
  }
}

function useActiveSection() {
  const [active, setActive] = useState(FLAT[0].id);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-10% 0px -80% 0px" },
    );
    FLAT.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

/* --------------------------------- page ---------------------------------- */

function Cheatsheet() {
  const active = useActiveSection();
  // Changing `expandKey` remounts the content so every code block picks up `startOpen`.
  const [startOpen, setStartOpen] = useState(false);
  const [expandKey, setExpandKey] = useState(0);
  const setAll = (open: boolean) => {
    setStartOpen(open);
    setExpandKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10">
        <aside className="sticky top-8 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto lg:block">
          <nav aria-label="Cheatsheet sections" className="space-y-5 text-sm">
            {GROUPS.map((g) => (
              <div key={g.label}>
                <p className="mb-1.5 font-medium">{g.label}</p>
                <ul className="space-y-0.5 border-l">
                  {g.sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className={`-ml-px block border-l py-1 pl-3 ${
                          active === s.id
                            ? "border-foreground font-medium text-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main className="max-w-3xl min-w-0 flex-1">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">Cove monorepo cheatsheet</h1>
            <p className="mt-2 text-muted-foreground">
              How to develop in this template. Code is collapsed by default.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setAll(true)}
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
              >
                Expand all code
              </button>
              <button
                type="button"
                onClick={() => setAll(false)}
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
              >
                Collapse all
              </button>
            </div>
            <nav aria-label="Jump to section" className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
              {FLAT.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="shrink-0 rounded-full border px-3 py-1 text-xs"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </header>

          <div key={expandKey}>
            {FLAT.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-8 border-t py-8 first:border-t-0">
                <h2 className="text-xl font-semibold tracking-tight">{s.title}</h2>
                <p className="mt-1 text-muted-foreground">
                  <Inline text={s.summary} />
                </p>
                {s.blocks.map((b, j) => (
                  <BlockView key={j} block={b} startOpen={startOpen} />
                ))}
                <div className="mt-6 flex justify-between text-sm">
                  {FLAT[i - 1] ? (
                    <a
                      href={`#${FLAT[i - 1].id}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Previous: {FLAT[i - 1].title}
                    </a>
                  ) : (
                    <span />
                  )}
                  {FLAT[i + 1] && (
                    <a
                      href={`#${FLAT[i + 1].id}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Next: {FLAT[i + 1].title}
                    </a>
                  )}
                </div>
              </section>
            ))}
          </div>

          <footer className="border-t py-6 text-xs text-muted-foreground">
            Based on the template README, AGENTS.md and .agents docs. Code samples are patterns:
            verify import paths and file names in your clone.
          </footer>
        </main>
      </div>
    </div>
  );
}
