import { createFileRoute } from "@tanstack/react-router";

import CreateProjectForm from "#/components/test/create_project_form";

export const Route = createFileRoute("/_auth/app/test/")({
  component: testPage,
});

function testPage() {
  return (
    <div>
      <h1>TESTING PAGE</h1>
      <CreateProjectForm />
      <hr className="mt-5" />
    </div>
  );
}
