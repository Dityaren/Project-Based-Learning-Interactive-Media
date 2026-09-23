import { useAuthSuspense } from "@repo/auth/tanstack/hooks";
import { Button } from "@repo/ui/components/button";
import { Link } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";
import { Suspense } from "react";

import { SignOutButton } from "#/components/sign-out-button.tsx";
export function IntroPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <div className="mx-auto max-w-4xl px-4 pt-14 pb-12 sm:px-6 md:pt-22">
        <Suspense fallback={<div className="mb-20 py-6">Loading session...</div>}>
          <UserAction />
        </Suspense>

        <TemplateSetupGuide />
      </div>
    </div>
  );
}
function UserAction() {
  const { user } = useAuthSuspense();

  return user ? (
    <section className="mb-20 flex flex-col items-center space-y-1.5">
      <div className="mb-4 flex w-full items-center gap-2">
        <div className="size-2 animate-pulse rounded-full bg-primary"></div>
        <h2 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          Session
        </h2>
      </div>
      <div className="w-full">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-full bg-border"></div>
              <div className="size-2.5 rounded-full bg-border"></div>
              <div className="size-2.5 rounded-full bg-border"></div>
              <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                useAuthSuspense() data
              </span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground/70 uppercase">
              ReadOnly
            </span>
          </div>
          <div className="overflow-x-auto p-6">
            <pre className="font-mono text-xs leading-relaxed text-foreground/80">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
        <div className="-mt-px mr-4 ml-auto flex w-fit flex-wrap items-center justify-end gap-2 rounded-b-xl border border-t-0 border-border bg-muted/30 px-4 py-3 shadow-sm md:mr-8">
          <Button render={<Link to="/app" />} className="w-fit" size="lg" nativeButton={false}>
            Go to /app
          </Button>
          <SignOutButton />
        </div>
      </div>
    </section>
  ) : (
    <section className="mb-20">
      <div className="mb-4 flex w-full items-center gap-2">
        <div className="size-2 rounded-full bg-muted-foreground/40"></div>
        <h2 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          Session
        </h2>
      </div>
      <div className="flex flex-col items-center rounded-2xl border border-border bg-card/50 px-6 py-8 text-center sm:px-10">
        <h3 className="text-lg font-semibold text-foreground">You are not signed in.</h3>
        <p className="mt-2 max-w-90 text-sm leading-relaxed text-muted-foreground">
          Nothing fancy. Just a quick demo of protected routes and the auth utilities in action.
        </p>
        <Button render={<Link to="/login" />} className="mt-6 w-fit" size="lg" nativeButton={false}>
          Log in
        </Button>
      </div>
    </section>
  );
}

function TemplateSetupGuide() {
  return (
    <details className="group mx-auto mb-16 max-w-[65ch] overflow-hidden rounded-xl border border-border bg-card/50 text-sm text-foreground/80">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 select-none [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block font-medium text-foreground">
            Just created a project from this stack?
          </span>
          <span className="mt-1 block text-muted-foreground">
            Expand for the starter cleanup checklist.
          </span>
        </span>
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>

      <div className="border-t border-border px-4 py-4">
        <ol className="list-decimal space-y-3 pl-5">
          <li>
            Delete{" "}
            <code className="rounded-md border border-border bg-card px-1 py-0.5">
              apps/web/src/components/_DELETE_ME_intro-page/
            </code>
            , which contains this page, its helper, and the example unit test.
          </li>
          <li>
            Delete{" "}
            <code className="rounded-md border border-border bg-card px-1 py-0.5">
              apps/web/e2e/_DELETE_ME_example-tests/
            </code>
            . The Playwright config needs no change.
          </li>
          <li>
            Replace the starter homepage in{" "}
            <code className="rounded-md border border-border bg-card px-1 py-0.5">
              apps/web/src/routes/index.tsx
            </code>
            .
          </li>
        </ol>
        <p className="mt-4 text-muted-foreground">
          The testing setup is intentionally lightweight. For short-lived prototypes, it can be
          safely ignored or removed.
        </p>
      </div>
    </details>
  );
}
