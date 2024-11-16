import { VehicleEntryRegistry } from "@/types/api";
import { axiosInstanceAuth } from "./axios-instance";
import { VehicleEntryRegistrySchema } from "./zod-schemas";
import { UserInfo } from "@/types/user";

export async function getVehicleEntries(
  searchQuery: string
): Promise<VehicleEntryRegistry[]> {
  const response = await axiosInstanceAuth.get("/api/vehicle-overview/", {
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

export const getProfileInfo = async (): Promise<UserInfo> => {
  const response = await axiosInstanceAuth.get("/api/profile-info/");
  return {
    userProfiles: response.data.user_profiles,
    nameOfUser: response.data.user_name,
  };
};
