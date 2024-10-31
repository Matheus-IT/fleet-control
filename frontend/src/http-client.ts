export function storeAuthTokens(refresh: string, access: string) {
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
}

export function getAccessToken() {
  localStorage.getItem("accessToken");
}
