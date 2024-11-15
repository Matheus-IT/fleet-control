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

export function setAuthCredentials(
  access: string | null,
  refresh: string | null
) {
  localStorage.setItem("accessToken", access ?? "");
  localStorage.setItem("refreshToken", refresh ?? "");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}
