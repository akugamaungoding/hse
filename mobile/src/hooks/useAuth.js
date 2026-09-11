import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { loginServices } from "@/services/loginServices";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginAction = async (username, password) => {
    try {
      setLoading(true);

      const loginData = await loginServices.login(username, password);

      if (loginData.token) {
        const targetApp = loginData.listAplikasi?.find(
          (app) => app.appId === "APP05",
        );

        if (targetApp) {
          const permData = await loginServices.getPermission(
            username,
            loginData.token,
          );

          if (permData.token) {
            setAuth({
              ...loginData,
              token: permData.token,
              listPermission: permData.listPermission,
            });

            return { success: true };
          }
        } else {
          return {
            success: false,
            message: "Anda tidak memiliki akses ke aplikasi ini.",
          };
        }
      }

      return {
        success: false,
        message: loginData.errorMessage || "Login Gagal",
      };
    } catch (error) {
      console.error("Login Error:", error);
      return {
        success: false,
        message:
          error.response?.data?.errorMessage ||
          "Username / Password tidak valid",
      };
    } finally {
      setLoading(false);
    }
  };

  return { loginAction, loading };
};
