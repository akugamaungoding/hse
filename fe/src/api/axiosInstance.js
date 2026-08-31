import axios from "axios";
import { Config } from "@/constants/config";
import { useAuthStore } from "@/store/useAuthStore";

const axiosInstance = axios.create({
  baseURL: Config.API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (config.params) {
      const cleanParams = Object.fromEntries(
        Object.entries(config.params).filter(
          ([, value]) => value !== "" && value !== null && value !== undefined
        )
      );
      config.params = cleanParams;
    }
    const authState = useAuthStore.getState();
    if (authState.userId) {
      config.headers["X-User-Id"] = authState.userId.toString();
    }
    if (authState.roleCode) {
      config.headers["X-Role-Code"] = authState.roleCode;
    }
    if (authState.username) {
      config.headers["X-Username"] = authState.username;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
