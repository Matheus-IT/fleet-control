import { VehicleEntryRegistry } from "@/types/api";
import { axiosInstance } from "./axios-instance";
import { VehicleEntryRegistrySchema } from "./zod-schemas";

export async function getVehicleEntries(
  searchQuery: string
): Promise<VehicleEntryRegistry[]> {
  const response = await axiosInstance.get("/api/vehicle-overview/", {
    params: {
      search_query: searchQuery,
    },
  });

  const parsedData = VehicleEntryRegistrySchema.array().safeParse(
    response.data
  );
  if (parsedData.success) {
    const vehicleEntries: VehicleEntryRegistry[] = parsedData.data;
    return vehicleEntries;
  }

  throw new Error(`Invalid data format from API: ${parsedData.error}`);
}

export const getProfileInfo = async () => {
  const response = await axiosInstance.get("/api/profile-info/");
  return response.data;
};
