import api from "@/api/axiosInstance";

export const loginServices = {
  login: async (username, password) => {
    const response = await api.post("Auth/login", {
      username,
      password,
      jenisAplikasi: "Mobile",
    });
    return response.data;
  },
  getPermission: async (username, token) => {
    const response = await api.post(
      "Auth/getpermission",
      {
        username,
        appId: "APP05",
        roleId: "ROL006",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },
};
