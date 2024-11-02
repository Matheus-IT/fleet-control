import { VehicleEntry, VehicleEntryDTO } from "@/types/api";
import { formatVehicleEntry } from "@/utils/vehicle-entries";
import { API_BASE_URL, fetchWithAuth } from "./http-client";

export async function getVehicleEntries(): Promise<VehicleEntry[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/vehicle-entries/`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const vehicleEntries: VehicleEntryDTO[] = await response.json();
  return vehicleEntries.map(formatVehicleEntry);
}
