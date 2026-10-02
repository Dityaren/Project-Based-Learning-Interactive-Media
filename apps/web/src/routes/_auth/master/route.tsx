import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/master")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/master"!</div>;
}
