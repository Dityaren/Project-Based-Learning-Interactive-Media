import { createFileRoute } from "@tanstack/react-router";

import AppTestPage from "#/components/app-test-page";

export const Route = createFileRoute("/_auth/app/test/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AppTestPage />;
}
