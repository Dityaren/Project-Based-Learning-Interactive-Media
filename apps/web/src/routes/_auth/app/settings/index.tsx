import { createFileRoute } from "@tanstack/react-router";

import { SettingsPage } from "#/components/app-settings-page";

export const Route = createFileRoute("/_auth/app/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SettingsPage />;
}
