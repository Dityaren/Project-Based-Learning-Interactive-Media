import { useAuthSuspense } from "@repo/auth/tanstack/hooks";
import { createFileRoute } from "@tanstack/react-router";
import { log } from "evlog";

export const Route = createFileRoute("/_auth/app/test/")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useAuthSuspense();
  return <>testpage</>;
}
