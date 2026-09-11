import { useAuthStore } from "@/store/useAuthStore";

export const hasPermission = (permission) => {
  const { listPermission } = useAuthStore.getState();
  return listPermission?.includes(permission);
};
