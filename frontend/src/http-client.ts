import { VehicleEntryDTO } from "./types/api";
import { formatVehicleEntry } from "./utils/vehicle-entries";

export default class HttpClient {
  static #host = "http://localhost:8000/";

  static get host() {
    return HttpClient.#host;
  }

  static async get(url: string) {
    return await fetch(HttpClient.host + url, {
      headers: {
        Authorization: "Bearer " + getAccessToken(),
      },
    });
  }
}

export const urls = {
  vehicleEntries: "api/vehicle-entries/",
};

export function storeAuthTokens(refresh: string, access: string) {
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
}

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}
export function setAccessToken(token: string) {
  return localStorage.setItem("accessToken", token);
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export const myQueries = {
  fetchVehicleEntries: {
    queryKey: ["fetchVehicleEntries"],
    queryFn: () =>
      fetch("http://localhost:8000/api/vehicle-entries/").then(async (res) => {
        const vehicleEntries: VehicleEntryDTO[] = await res.json();
        return vehicleEntries.map(formatVehicleEntry);
      }),
  },
};
