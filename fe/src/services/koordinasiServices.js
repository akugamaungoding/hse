import api from "@/api/axiosInstance";

export const koordinasiServices = {
  getHistory: async (kejadianId) => {
    const response = await api.get(`Koordinasi/kejadian/${kejadianId}`);
    return response.data;
  },
  update: async (kejadianId, catatan) => {
    const response = await api.post(`Koordinasi/kejadian/${kejadianId}/update`, { catatan });
    return response.data;
  },
  tetapkanAman: async (kejadianId) => {
    const response = await api.post(`Koordinasi/kejadian/${kejadianId}/tetapkan-aman`);
    return response.data;
  },
};
