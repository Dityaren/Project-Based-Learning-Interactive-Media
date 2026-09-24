import { createFileRoute } from "@tanstack/react-router";

import { ProfilePage } from "#/components/app-profile-page";

export const Route = createFileRoute("/_auth/app/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProfilePage />;
}
