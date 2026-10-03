import { auth } from "@repo/auth/auth";
import { createFileRoute } from "@tanstack/react-router";

const users = [
  { name: "Master", email: "master@pjbl.local", role: "master" },
  { name: "Admin", email: "admin@pjbl.local", role: "admin" },
  { name: "Teacher", email: "teacher@pjbl.local", role: "teacher" },
  { name: "Student", email: "student@pjbl.local", role: "student" },
];

export const Route = createFileRoute("/api/dev/users-seed")({
  server: {
    handlers: {
      POST: async () => {
        if (!import.meta.env.DEV) return new Response("Not found", { status: 404 });
        for (const u of users) {
          await auth.api.createUser({ body: { ...u, password: "ChangeMe123!" } as never });
        }
        return Response.json({ ok: true });
      },
    },
  },
});
