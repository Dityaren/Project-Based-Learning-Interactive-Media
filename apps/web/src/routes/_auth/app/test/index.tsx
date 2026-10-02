import { useAuthSuspense } from "@repo/auth/tanstack/hooks";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { log } from "evlog";

import CreateProjectForm from "./create_project_form";

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
