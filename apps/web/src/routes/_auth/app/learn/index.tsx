import { createFileRoute } from "@tanstack/react-router";

import { LearnPage } from "#/components/app-learn-page";

export const Route = createFileRoute("/_auth/app/learn/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LearnPage />;
}
