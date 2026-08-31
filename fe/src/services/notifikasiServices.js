import api from "@/api/axiosInstance";

export const notifikasiServices = {
  getAll: async ({ pageNumber = 1, pageSize = 20 } = {}) => {
    const response = await api.get("Notifikasi", { params: { pageNumber, pageSize } });
    return response.data;
  },
  getUnreadCount: async () => {
    const response = await api.get("Notifikasi/unread-count");
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await api.patch(`Notifikasi/${id}/read`);
    return response.data;
  },
};
