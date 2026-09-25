import { authClient } from "@repo/auth/auth-client";
import { authQueryOptions } from "@repo/auth/tanstack/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

export function SidebarSignOutButton() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onResponse: async () => {
              // manually set to null to avoid unnecessary refetching
              queryClient.setQueryData(authQueryOptions().queryKey, null);
              await router.navigate({ to: "/login" });
            },
          },
        });
      }}
      type="button"
      className="flex h-9 w-full items-center gap-2 rounded-lg px-2 text-sm text-muted-foreground transition-colors group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 hover:bg-destructive/10 hover:text-destructive"
    >
      <LogOut className="size-4 shrink-0" />
      <span className="group-data-[collapsible=icon]:hidden">Sign out</span>
    </button>
  );
}
