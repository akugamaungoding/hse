import api from "@/api/axiosInstance";

export const evakuasiServices = {
  getByKejadian: async (kejadianId) => {
    const response = await api.get(`Evakuasi/kejadian/${kejadianId}`);
    return response.data;
  },
  instruksi: async (evakuasiId) => {
    const response = await api.post(`Evakuasi/${evakuasiId}/instruksi`);
    return response.data;
  },
  selesai: async (evakuasiId, catatan) => {
    const response = await api.post(`Evakuasi/${evakuasiId}/selesai`, { catatan });
    return response.data;
  },
};
