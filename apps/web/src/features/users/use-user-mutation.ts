import { toast } from "@repo/ui/components/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const USERS_KEY = ["admin", "users"] as const;

type Options<T, R> = {
  onDone: () => void;
  success: string | ((result: R, input: T) => string);
};

export function useUserMutation<T, R = unknown>(
  fn: (opts: { data: T }) => Promise<R>,
  { onDone, success }: Options<T, R>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: T) => fn({ data }),
    onSuccess: async (result, input) => {
      await qc.invalidateQueries({ queryKey: USERS_KEY });
      const message = typeof success === "function" ? success(result, input) : success;

      toast.add({ type: "success", description: message || "Done" });

      onDone();
    },
  });
}
