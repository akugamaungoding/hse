import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";

export function RoleGuard({ children, allowedRoles }) {
  const { isAuthenticated, roleCode } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roleCode !== "SUPER_ADMIN" && allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(roleCode)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="text-center">
          <p className="font-['Poppins',sans-serif] font-bold text-lg text-gray-800">Akses Ditolak</p>
          <p className="text-sm text-gray-500 mt-1">Halaman ini tidak tersedia untuk role Anda.</p>
        </div>
      </div>
    );
  }

  return children;
}
