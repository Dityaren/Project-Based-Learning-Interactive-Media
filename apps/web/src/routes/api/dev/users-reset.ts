import { db } from "@repo/db";
import { user } from "@repo/db/schema";
import { createFileRoute } from "@tanstack/react-router";
import { ENV } from "varlock/env";

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1", "postgres", "db"]; // docker-compose service names

export const Route = createFileRoute("/api/dev/users-reset")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!import.meta.env.DEV) return new Response("Not found", { status: 404 });

        const host = new URL(ENV.DATABASE_URL).hostname;
        if (!LOCAL_HOSTS.includes(host)) {
          return new Response(`Refusing to run against non-local database (${host})`, {
            status: 403,
          });
        }

        const deleted = await db.delete(user).returning({ id: user.id });

        return Response.json({ ok: true, deleted: deleted.length });
      },
    },
  },
});
