import { toast } from "@repo/ui/components/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Options<T, R> = {
  invalidate: readonly unknown[];
  success: string | ((result: R, input: T) => string);
  onDone?: () => void;
};

export function useAppMutation<T, R = unknown>(
  fn: (opts: { data: T }) => Promise<R>,
  o: Options<T, R>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: T) => fn({ data }),
    onSuccess: async (result, input) => {
      await qc.invalidateQueries({ queryKey: o.invalidate });
      toast.add({
        type: "success",
        description:
          (typeof o.success === "function" ? o.success(result, input) : o.success) || "Done",
      });
      o.onDone?.();
    },
  });
}
