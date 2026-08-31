import api from "@/api/axiosInstance";

export const pemadamanServices = {
  get: async (kejadianId) => {
    const response = await api.get(`Pemadaman/kejadian/${kejadianId}`);
    return response.data;
  },
  upsert: async (kejadianId, payload) => {
    const response = await api.post(`Pemadaman/kejadian/${kejadianId}`, payload);
    return response.data;
  },
};
