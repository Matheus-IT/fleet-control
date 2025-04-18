import {
  AuthCredentials,
  ResponsableTeam,
  SubmitLoginCredentials,
  VehicleEntryRegistryDetail,
  VehicleEntry,
  VehicleEntryRegistryList,
  VehicleEntryStatus,
  VehicleExitRegistry,
  Workshop,
  VehicleEntryRegistry,
} from "@/types/api";
import { axiosInstance, axiosInstanceAuth } from "./axios-instance";
import {
  ResponsableTeamSchema,
  VehicleEntryRegistrySchemaDetail,
  VehicleRegistrySchemaList,
  VehicleEntrySchema,
  VehicleExitRegistrySchema,
  VehicleHistoryReturnSchema,
  VehicleSchema,
  WorkshopSchema,
  VehicleEntryRegistrySchema,
} from "./zod-schemas";
import { UserInfo } from "@/types/user";

export async function getVehicleEntries(
  searchQuery: string,
  itemsPerPage: number,
  currentPage: number,
  filterAtWorkshopStatus: boolean | null
) {
  const response = await axiosInstanceAuth.get("/api/vehicle-overview/", {
    params: {
      search_query: searchQuery,
      per_page: itemsPerPage,
      page: currentPage,
      filter_at_workshop_status: filterAtWorkshopStatus,
    },
  });

  console.log("response.data", response.data);

  const parsedData = VehicleRegistrySchemaList.array().safeParse(
    response.data.results
  );
  if (parsedData.success) {
    const vehicleEntries: VehicleEntryRegistryList[] = parsedData.data;
    return {
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
      results: vehicleEntries,
      numPages: response.data.num_pages,
    };
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

  const parsedData = VehicleHistoryReturnSchema.safeParse(res.data);

  if (parsedData.success) return parsedData.data;
  else console.log("Error at getVehicleHistory", parsedData.error);
}

export async function getVehicleHistoryCSV(vehicle_id: string) {
  const res = await axiosInstanceAuth.get(
    `/api/vehicle-history-csv/${vehicle_id}/`,
    {
      responseType: "blob",
    }
  );

  // Extract the filename from the Content-Disposition header
  const contentDisposition = res.headers["content-disposition"];
  let filename = `vehicle_${vehicle_id}_history.csv`; // Default filename
  if (contentDisposition && contentDisposition.includes("filename=")) {
    filename = contentDisposition
      .split("filename=")[1]
      .split(";")[0]
      .replace(/['"]/g, ""); // Remove any quotes around the filename
  }

  const blob = new Blob([res.data], { type: "text/csv" });

  const url = window.URL.createObjectURL(blob);

  // Create a temporary <a> element to trigger the download with the correct filename
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename); // Set the filename for the download
  document.body.appendChild(link);
  link.click();

  // Clean up
  link.remove();
  window.URL.revokeObjectURL(url);
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
  vehicle_slug: string
): Promise<VehicleEntryRegistryDetail> {
  const res = await axiosInstanceAuth.get(
    `/api/get-last-entry-record-from-vehicle/${vehicle_slug}/`
  );
  console.log("res.data", res.data);
  try {
    const parsedData = VehicleEntryRegistrySchemaDetail.parse(res.data);
    console.log("parsedData", parsedData);

    return parsedData;
  } catch (e) {
    console.log("e", e);
    return {} as VehicleEntryRegistryDetail;
  }
}

export async function approveEntryRequest(
  last_entry_request_id: number,
  responsible_id: number
): Promise<VehicleEntryRegistryList> {
  const res = await axiosInstanceAuth.patch(
    `/api/vehicle-entry-registries/${last_entry_request_id}/`,
    {
      status: VehicleEntryStatus.APPROVED,
      assessment_responsible: responsible_id,
    }
  );

  const parsedData = VehicleRegistrySchemaList.parse(res.data);
  return parsedData;
}

export async function doNotApproveEntryRequest(
  last_entry_request_id: number,
  observation: string,
  responsible_id: number
): Promise<VehicleEntryRegistry | undefined> {
  try {
    const res = await axiosInstanceAuth.patch(
      `/api/vehicle-entry-registries/${last_entry_request_id}/`,
      {
        status: VehicleEntryStatus.NOT_APPROVED,
        observation: observation,
        assessment_responsible: responsible_id,
      }
    );
    const parsedData = VehicleEntryRegistrySchema.parse(res.data);
    return parsedData;
  } catch (e) {
    console.log("e", e);
  }
}
