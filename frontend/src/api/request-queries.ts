import {
  AuthCredentials,
  ResponsableTeam,
  SubmitLoginCredentials,
  Vehicle,
  VehicleEntry,
  VehicleEntryRegistry,
  VehicleEntryRegistryChoices,
  VehicleExitRegistry,
  Workshop,
} from "@/types/api";
import { axiosInstance, axiosInstanceAuth } from "./axios-instance";
import {
  ResponsableTeamSchema,
  VehicleEntryRegistrySchema,
  VehicleEntrySchema,
  VehicleExitRegistrySchema,
  VehicleHistoryReturnSchema,
  VehicleSchema,
  WorkshopSchema,
} from "./zod-schemas";
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
    id: response.data.id,
    userProfiles: response.data.user_profiles,
    nameOfUser: response.data.user_name,
  };
};

export async function getVehicle(slug: string) {
  const res = await axiosInstanceAuth.get(`/api/vehicles/${slug}`);
  const parsedData = VehicleSchema.safeParse(res.data);

  if (parsedData.success) {
    return parsedData.data;
  }
}

export async function getVehicleHistory(slug: string) {
  const res = await axiosInstanceAuth.get(`/api/vehicle-history/${slug}`);
  console.log("res.data", res.data);

  const parsedData = VehicleHistoryReturnSchema.safeParse(res.data);

  if (parsedData.success) return parsedData.data;
  else console.log("Error at getVehicleHistory", parsedData.error);
}

export async function getTeams() {
  const res = await axiosInstanceAuth.get("/api/teams/");
  const parsedData = ResponsableTeamSchema.array().safeParse(res.data);
  if (parsedData.success) {
    return parsedData.data as ResponsableTeam[];
  }
}

export async function getWorkshops() {
  const res = await axiosInstanceAuth.get("/api/workshops/");
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

export async function submitCreateVehicleExitRecord(vehicle_id: number) {
  const response = await axiosInstanceAuth.post(
    "/api/create-vehicle-exit-record/",
    { vehicle_id }
  );
  const parsedData = VehicleExitRegistrySchema.safeParse(response.data);
  if (parsedData.success) {
    console.log("parsedData.success");
    return parsedData.data as VehicleExitRegistry;
  }
  console.log("parsedData deu ruim :(");
}

export async function getLastEntryRecordFromVehicle(
  vehicle: Vehicle
): Promise<VehicleEntryRegistry> {
  const res = await axiosInstanceAuth.get(
    `/api/get-last-entry-record-from-vehicle/${vehicle.id}/`
  );
  const parsedData = VehicleEntryRegistrySchema.parse(res.data);
  return parsedData;
}

export async function approveEntryRequest(
  last_entry_request_id: number
): Promise<VehicleEntryRegistry> {
  const res = await axiosInstanceAuth.patch(
    `/api/vehicle-entry-registries/${last_entry_request_id}/`,
    { status: VehicleEntryRegistryChoices.APPROVED }
  );
  console.log("res", res);
  console.log("res.data", res.data);

  const parsedData = VehicleEntryRegistrySchema.parse(res.data);
  return parsedData;
}
