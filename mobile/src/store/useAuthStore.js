import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      nama: null,
      listAplikasi: [],
      isAuthenticated: false,


      setAuth: (data) =>
        set({
          token: data.token,
          nama: data.nama,
          listAplikasi: data.listAplikasi,
          isAuthenticated: true,
          listPermission: data.listPermission || [],
        }),

      logout: () =>
        set({
          token: null,
          nama: null,
          listAplikasi: [],
          isAuthenticated: false,
          listPermission: [],
        }),
    }),
    { name: "auth-storage", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
