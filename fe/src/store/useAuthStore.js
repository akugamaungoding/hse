import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      userId: null,
      username: null,
      nama: null,
      roleCode: null,
      roleName: null,
      email: null,
      noHp: null,
      isAuthenticated: false,

      setAuth: (data) =>
        set({
          token: data.token,
          userId: data.userId,
          username: data.username,
          nama: data.nama,
          roleCode: data.roleCode,
          roleName: data.roleName,
          email: data.email,
          noHp: data.noHp,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          userId: null,
          username: null,
          nama: null,
          roleCode: null,
          roleName: null,
          email: null,
          noHp: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "td-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
