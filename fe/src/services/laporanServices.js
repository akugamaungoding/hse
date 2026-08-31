import api from "@/api/axiosInstance";

export const laporanServices = {
  getAll: async (pageNumber = 1, pageSize = 20) => {
    const response = await api.get("Laporan", { params: { pageNumber, pageSize } });
    return response.data;
  },
  get: async (kejadianId) => {
    const response = await api.get(`Laporan/kejadian/${kejadianId}`);
    return response.data;
  },
  create: async (kejadianId, { ringkasan, tindakLanjut }) => {
    const response = await api.post(`Laporan/kejadian/${kejadianId}`, { ringkasan, tindakLanjut });
    return response.data;
  },
};
