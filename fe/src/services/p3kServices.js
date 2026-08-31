import api from "@/api/axiosInstance";

export const p3kServices = {
  get: async (kejadianId) => {
    const response = await api.get(`P3K/kejadian/${kejadianId}`);
    return response.data;
  },
  upsert: async (kejadianId, payload) => {
    const response = await api.post(`P3K/kejadian/${kejadianId}`, payload);
    return response.data;
  },
};
