import { useQuery } from "@tanstack/react-query";
import {
  getProfileInfo,
  getTeams,
  getVehicle,
  getVehicleEntries,
} from "@/api/request-queries";

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

export function useGetVehicle(slug: string) {
  return useQuery({
    queryKey: ["getVehicle"],
    queryFn: () => getVehicle(slug),
  });
}
export function useGetTeams() {
  return useQuery({
    queryKey: ["getTeams"],
    queryFn: getTeams,
  });
}
