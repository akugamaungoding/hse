import { useState } from "react";
import { authServices } from "@/services/authServices";
import { useAuthStore } from "@/store/useAuthStore";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginAction = async (username, password) => {
    try {
      setLoading(true);
      const res = await authServices.login(username, password);

      if (!res.token) {
        return { success: false, message: res.errorMessage || "Login gagal." };
      }

      setAuth({
        token: res.token,
        userId: res.userId,
        username: res.username,
        nama: res.nama,
        roleCode: res.roleCode,
        roleName: res.roleName,
        email: res.email,
        noHp: res.noHp,
      });

      return { success: true, roleCode: res.roleCode };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login gagal. Periksa koneksi Anda.",
      };
    } finally {
      setLoading(false);
    }
  };

  return { loginAction, loading };
};
