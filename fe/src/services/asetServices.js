import api from "@/api/axiosInstance";

export const asetServices = {
  getAll: async ({ tipe, status } = {}) => {
    const response = await api.get("Aset", { params: { tipe, status } });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`Aset/${id}`);
    return response.data;
  },
  submitInspeksi: async (id, { status, catatan, fotoUrl, formData }) => {
    const response = await api.post(`Aset/${id}/inspeksi`, { status, catatan, fotoUrl, formData });
    return response.data;
  },
  getHistory: async (id) => {
    const response = await api.get(`Aset/${id}/riwayat`);
    return response.data;
  },
  getRecentInspeksi: async (limit = 5) => {
    const response = await api.get("Aset/recent-inspeksi", { params: { limit } });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("Aset", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`Aset/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`Aset/${id}`);
    return response.data;
  },
};
