import api from "@/api/axiosInstance";

export const authServices = {
  login: async (username, password) => {
    const response = await api.post("Auth/login", { username, password });
    return response.data;
  },
  me: async () => {
    const response = await api.get("Auth/me");
    return response.data;
  },
  getUsersByRole: async (roleCode) => {
    const response = await api.get(`Auth/users-by-role/${roleCode}`);
    return response.data;
  },
};
