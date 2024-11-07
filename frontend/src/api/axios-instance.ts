import axios from "axios";
import { API_BASE_URL } from "./http-client";
import { getAccessToken, getRefreshToken, setAccessToken } from "./auth-tokens";
import { RefreshTokenExpiredError } from "@/types/errors";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: base,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
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
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Try to refresh the token
        const response = await axios.post(`${base}/api/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        setAccessToken(access);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (refreshError) {
        throw new RefreshTokenExpiredError();
      }
    }

    return Promise.reject(error);
  }
);
