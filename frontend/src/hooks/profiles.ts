import { useQuery } from "@tanstack/react-query";
import { getProfileInfo } from "@/api/request-queries";

export function useProfileInfo() {
  const query = useQuery({
    queryKey: ["profileInfo"],
    queryFn: getProfileInfo,
    retry: false,
  });

  return query;
}
