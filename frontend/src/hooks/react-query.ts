import {
  useMutation,
  UseMutationOptions,
  UseQueryOptions,
  useQuery,
  QueryKey,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { RefreshTokenExpiredError } from "@/types/errors";

export function useAuthenticatedMutation(
  mutationFn: () => Promise<unknown>,
  options?: UseMutationOptions
) {
  const router = useRouter();

  return useMutation({
    mutationFn,
    ...options,
    onError: (error, variables, context) => {
      if (error.message === "auth_required") {
        router.push("/login");
      }
      options?.onError?.(error, variables, context);
    },
  });
}

export function useAuthenticatedQuery<TData, TError = AxiosError>(
  key: QueryKey,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData>, "queryKey" | "queryFn">
) {
  const router = useRouter();

  return useQuery<TData, TError>({
    queryKey: key,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error) {
        if (error instanceof RefreshTokenExpiredError) {
          router.push("/login");
        }
        throw error;
      }
    },
    ...options,
  });
}
