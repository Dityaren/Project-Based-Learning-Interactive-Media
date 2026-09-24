import { createFileRoute } from "@tanstack/react-router";

import { ProjectsPage } from "#/components/app-projects-page";

export const Route = createFileRoute("/_auth/app/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProjectsPage />;
}
