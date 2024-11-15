import axios, { AxiosError } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setAuthCredentials,
} from "./auth-tokens";

const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const config = {
  baseURL: base,
  headers: {
    "Content-Type": "application/json",
  },
};

export const axiosClient = axios.create(config);

export const axiosInstanceAuth = axios.create(config);

// Request interceptor to add auth token
axiosInstanceAuth.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstanceAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          redirectToLogin();
          return Promise.reject(error);
        }

        // Try to refresh the token
        const response = await axios.post(`${base}/api/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        setAccessToken(access);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;

        return axiosInstanceAuth(originalRequest);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (refreshError) {
        // refresh token expirou
        if (error instanceof AxiosError && error.response?.status === 401) {
          setAuthCredentials(null, null);
          await new Promise((resolve) => setTimeout(resolve, 5000));
          redirectToLogin();
          return;
        }
      }
    }

    return Promise.reject(error);
  }
);

export function redirectToLogin() {
  window.location.href = "/login";
}
