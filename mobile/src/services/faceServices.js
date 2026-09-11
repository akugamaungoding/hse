import api from "@/api/axiosInstance";

export const faceServices = {
  register: async (payload) => {
    const formData = new FormData();

    formData.append("UserId", payload.employeeId);
    formData.append("FullName", payload.fullName);

    formData.append("Image", {
      uri: payload.image.uri,
      type: payload.image.type,
      name: payload.image.name,
    });

    const response = await api.post("FaceRecognition/Register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  verify: async (payload) => {
    const formData = new FormData();

    formData.append("UserId", payload.employeeId);

    formData.append("Image", {
      uri: payload.image.uri,
      type: payload.image.type,
      name: payload.image.name,
    });

    const response = await api.post("FaceRecognition/Verify", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  train: async () => {
    const response = await api.post("FaceRecognition/Train");

    return response.data;
  },
};
