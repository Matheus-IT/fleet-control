import { useQuery } from "@tanstack/react-query";
import { getProfileInfo, getVehicleEntries } from "@/api/request-queries";

export function useGetProfileInfo() {
  return useQuery({
    queryKey: ["getProfileInfo"],
    queryFn: getProfileInfo,
  });
}

export function useGetVehicleEntries(searchQuery: string) {
  return useQuery({
    queryKey: ["getVehicleEntries"],
    queryFn: () => getVehicleEntries(searchQuery),
  });
}
