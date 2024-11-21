import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getProfileInfo,
  getTeams,
  getVehicle,
  getVehicleEntries,
  getWorkshops,
} from "@/api/request-queries";
import { axiosClientAuth } from "@/api/axios-instance";

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

export function useGetWorkshops() {
  return useQuery({
    queryKey: ["getWorkshops"],
    queryFn: getWorkshops,
  });
}

interface CreateRecordData {
  vehicle_id?: number;
  kilometer: string;
  problem_reported: string;
  team_id?: number;
  workshop_id?: number;
}

export function useCreateRecordMutation() {
  return useMutation({
    mutationFn: async (data: CreateRecordData) => {
      const response = await axiosClientAuth.post(
        "/api/vehicle-registry",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Record created successfully:", data);
    },
    onError: (error) => {
      console.error("Error creating record:", error);
      throw error;
    },
  });
}
