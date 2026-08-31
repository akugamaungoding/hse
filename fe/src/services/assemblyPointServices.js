import api from "@/api/axiosInstance";

export const assemblyPointServices = {
  scan: async (kejadianId, kodeAssemblyPoint) => {
    const response = await api.post("AssemblyPoint/scan", { kejadianId, kodeAssemblyPoint });
    return response.data;
  },
  getRekap: async (kejadianId) => {
    const response = await api.get(`AssemblyPoint/kejadian/${kejadianId}/rekap`);
    return response.data;
  },
  getList: async (kejadianId) => {
    const response = await api.get(`AssemblyPoint/kejadian/${kejadianId}/list`);
    return response.data;
  },
  konfirmasiLengkap: async (kejadianId) => {
    const response = await api.post(`AssemblyPoint/kejadian/${kejadianId}/konfirmasi-lengkap`);
    return response.data;
  },
};
