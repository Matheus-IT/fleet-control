import {
  AuthCredentials,
  ResponsableTeam,
  SubmitLoginCredentials,
  VehicleEntry,
  VehicleEntryRegistry,
  Workshop,
} from "@/types/api";
import { axiosInstance, axiosInstanceAuth } from "./axios-instance";
import {
  ResponsableTeamSchema,
  VehicleEntryRegistrySchema,
  VehicleEntrySchema,
  VehicleSchema,
  WorkshopSchema,
} from "./zod-schemas";
import { UserInfo } from "@/types/user";

export async function getVehicleEntries(
  searchQuery: string
): Promise<VehicleEntryRegistry[]> {
  const response = await axiosClientAuth.get("/api/vehicle-overview/", {
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
  const response = await axiosClientAuth.get("/api/profile-info/");
  return {
    id: response.data.id,
    userProfiles: response.data.user_profiles,
    nameOfUser: response.data.user_name,
  };
};

export async function getVehicle(slug: string) {
  const res = await axiosClientAuth.get(`/api/vehicles/${slug}`);
  const parsedData = VehicleSchema.safeParse(res.data);
  if (parsedData.success) {
    return parsedData.data;
  }
}

export async function getTeams() {
  const res = await axiosClientAuth.get("/api/teams/");
  const parsedData = ResponsableTeamSchema.array().safeParse(res.data);
  if (parsedData.success) {
    return parsedData.data as ResponsableTeam[];
  }
}

export async function getWorkshops() {
  const res = await axiosClientAuth.get("/api/workshops/");
  const parsedData = WorkshopSchema.array().safeParse(res.data);
  if (parsedData.success) {
    return parsedData.data as Workshop[];
  }
}

export async function submitLogin(
  credentials: SubmitLoginCredentials
): Promise<AuthCredentials> {
  const res = await axiosInstance.post("/api/token/", credentials);
  return res.data;
}

export async function submitCreateVehicleEntry(data: VehicleEntry) {
  const response = await axiosInstanceAuth.post(
    "/api/vehicle-entry-registries/",
    data
  );
  const parsedData = VehicleEntrySchema.safeParse(response.data);
  if (parsedData.success) {
    console.log("parsedData.success");
    return parsedData.data as VehicleEntry;
  }
  console.log("parsedData deu ruim :(");
}
