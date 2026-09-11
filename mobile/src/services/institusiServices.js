import api from "@/api/axiosInstance";

export const institusiServices = {
  get: async (params) => {
    const response = await api.get("Institusi/GetAllInstitusi", { params });
    return response.data;
  },
  getDetail: async (id) => {
    const response = await api.get(`Institusi/DetailInstitusi/${id}`);
    return response.data;
  },
  create: async (payload) => {
    const response = await api.post("Institusi/CreateInstitusi", payload);
    return response.data;
  },
  update: async (id, payload) => {
    const response = await api.put(`Institusi/UpdateInstitusi/${id}`, payload);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`Institusi/DeleteInstitusi/${id}`);
    return response.data;
  },
};
