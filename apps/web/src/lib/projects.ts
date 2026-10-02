import { authMiddleware } from "@repo/auth/tanstack/middleware";
import { db } from "@repo/db";
import { projects } from "@repo/db/schema";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";

export const $getProjects = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) =>
    db
      .select()
      .from(projects)
      .where(eq(projects.authorId, context.user.id))
      .orderBy(desc(projects.createdAt)),
  );

export const $createProject = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { name: string; description?: string }) => d)
  .handler(async ({ context, data }) => {
    const [project] = await db
      .insert(projects)
      .values({ ...data, authorId: context.user.id })
      .returning();
    return project;
  });

export const projectsQueryOptions = () =>
  queryOptions({
    queryKey: ["projects"],
    queryFn: ({ signal }) => $getProjects({ signal }),
  });
