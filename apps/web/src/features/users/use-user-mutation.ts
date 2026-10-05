import { useMutation, useQueryClient } from "@tanstack/react-query";

export const USERS_KEY = ["admin", "users"] as const;

export function useUserMutation<T>(
  fn: (opts: { data: T }) => Promise<unknown>,
  onSuccess: () => void,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: T) => fn({ data }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: USERS_KEY });
      onSuccess();
    },
  });
}
