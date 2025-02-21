import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getProfileInfo,
  getTeams,
  getVehicle,
  getVehicleEntries,
  getVehicleHistory,
  getWorkshops,
  submitCreateVehicleEntry,
  submitCreateVehicleExitRecord,
} from "@/api/request-queries";
import { errorToast, successToast } from "./toast";

export function useGetProfileInfo() {
  return useQuery({
    queryKey: ["getProfileInfo"],
    queryFn: getProfileInfo,
  });
}

export function useGetVehicleEntries(
  searchQuery: string,
  itemsPerPage: number,
  currentPage: number,
  filterAtWorkshopStatus: boolean | null
) {
  return useQuery({
    queryKey: [
      "getVehicleEntries",
      currentPage,
      searchQuery,
      filterAtWorkshopStatus,
    ],
    queryFn: () =>
      getVehicleEntries(
        searchQuery,
        itemsPerPage,
        currentPage,
        filterAtWorkshopStatus
      ),
  });
}

export function useGetVehicle(slug: string) {
  return useQuery({
    queryKey: ["getVehicle"],
    queryFn: () => getVehicle(slug),
  });
}

export function useGetVehicleHistory(slug: string) {
  return useQuery({
    queryKey: ["getVehicleHistory"],
    queryFn: () => {
      try {
        return getVehicleHistory(slug);
      } catch (e) {
        console.log("error", e);
      }
    },
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

export function useCreateVehicleExitRecordMutation(vehicle_id: number) {
  return useMutation({
    mutationFn: () => submitCreateVehicleExitRecord(vehicle_id),
    onSuccess: (data) => {
      console.log("Record created successfully:", data);
      successToast("Saída registrada com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating record:", error);
      errorToast("Ocorreu um erro!");
      throw error;
    },
  });
}
