import { VehicleEntry, VehicleEntryDTO } from "@/types/api";
import { formatVehicleEntry } from "@/utils/vehicle-entries";
import { axiosInstance } from "./axios-instance";

export async function getVehicleEntries(): Promise<VehicleEntry[]> {
  const response = await axiosInstance.get("/api/vehicle-entries/");
  const vehicleEntries: VehicleEntryDTO[] = response.data;
  return vehicleEntries.map(formatVehicleEntry);
}

export const getProfileInfo = async () => {
  const response = await axiosInstance.get("/api/profile-info/");
  return response.data;
};
