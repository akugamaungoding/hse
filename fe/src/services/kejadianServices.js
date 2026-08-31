import api from "@/api/axiosInstance";

export const kejadianServices = {
  alert: async ({ jenisKejadian, lokasi, deskripsi, fotoUrl }) => {
    const response = await api.post("Kejadian/alert", { jenisKejadian, lokasi, deskripsi, fotoUrl });
    return response.data;
  },
  getAll: async ({ status, pageNumber = 1, pageSize = 20, urut } = {}) => {
    const response = await api.get("Kejadian", { params: { status, pageNumber, pageSize, urut } });
    return response.data;
  },
  getAktif: async () => {
    const response = await api.get("Kejadian/aktif");
    return response.data;
  },
  getStatus: async (id) => {
    const response = await api.get(`Kejadian/${id}/status`);
    return response.data;
  },
  validasi: async (id, { hasilValidasi, catatan }) => {
    const response = await api.post(`Kejadian/${id}/validasi`, { hasilValidasi, catatan });
    return response.data;
  },
  pengumumanDarurat: async (id) => {
    const response = await api.post(`Kejadian/${id}/pengumuman-darurat`);
    return response.data;
  },
  pengumumanAman: async (id) => {
    const response = await api.post(`Kejadian/${id}/pengumuman-aman`);
    return response.data;
  },
};
