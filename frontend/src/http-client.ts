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
