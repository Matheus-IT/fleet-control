import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getProfileInfo,
  getTeams,
  getVehicle,
  getVehicleEntries,
  getWorkshops,
  submitCreateVehicleEntry,
} from "@/api/request-queries";
import { errorToast, successToast } from "./toast";

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

export function useCreateRecordMutation() {
  return useMutation({
    mutationFn: submitCreateVehicleEntry,
    onSuccess: (data) => {
      console.log("Record created successfully:", data);
      successToast("Entrada registrada com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating record:", error);
      errorToast("Ocorreu um erro!");
      throw error;
    },
  });
}
