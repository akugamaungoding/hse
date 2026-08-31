import { useState } from "react";
import { LogOut, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { MobileContainer } from "./MobileContainer";

export function PetugasLayout({ title, subtitle, children }) {
  const navigate = useNavigate();
  const { nama, roleName, roleCode, logout } = useAuthStore();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const handleLogout = () => {
    setShowConfirmLogout(true);
  };

  return (
    <MobileContainer>
      <div className="w-full h-full bg-[#f9fafb] font-['Poppins',sans-serif] flex flex-col overflow-hidden">
        <div className="bg-[#0140c7] text-white px-4 py-3.5 shrink-0 relative z-10 shadow-md">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h1 className="font-bold text-sm leading-tight truncate">{title}</h1>
              {subtitle && <p className="text-blue-200 text-[10px] mt-0.5 truncate">{subtitle}</p>}
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-semibold leading-tight">{nama}</p>
              <div className="flex items-center gap-1.5 justify-end mt-1">
                <span className="text-[9px] text-blue-200">{roleName}</span>
                {roleCode === "SUPER_ADMIN" ? (
                  <button
                    onClick={() => navigate("/utama")}
                    className="p-1 bg-white/15 rounded hover:bg-white/25 transition-colors flex items-center gap-1 text-[9px] font-bold"
                    title="Kembali ke Utama"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Kembali</span>
                  </button>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="p-1 bg-white/15 rounded hover:bg-white/25 transition-colors"
                    title="Keluar"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-3 pb-16">
          {children}
        </div>
      </div>

      {showConfirmLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl text-center">
            <h3 className="font-['Poppins'] font-bold text-gray-800 text-lg mb-2">Konfirmasi Keluar</h3>
            <p className="text-sm text-gray-500 mb-6 font-['Poppins']">Apakah Anda yakin ingin keluar dari aplikasi?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmLogout(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-colors font-['Poppins']"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  setShowConfirmLogout(false);
                  logout();
                  navigate("/login");
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-md shadow-red-200 font-['Poppins']"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </MobileContainer>
  );
}
