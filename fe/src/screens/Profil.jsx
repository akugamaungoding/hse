import { useState } from "react";
import { MobileContainer } from "../components/MobileContainer";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import { useNavigate } from "react-router";
import { LogOut, User, Mail, Briefcase, Phone, Shield } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export function Profil() {
  const navigate = useNavigate();
  const auth = useAuthStore();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const handleLogout = () => {
    setShowConfirmLogout(true);
  };

  return (
    <MobileContainer>
      <div className="flex flex-col h-full bg-[#f9fafb] relative pb-[80px]">
        <Header title="Profil Saya" showBack={false} />

        <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
          { }          <div className="bg-[#0140c7] text-white p-6 rounded-2xl shadow-md mb-6 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-1 font-['Poppins']">{auth.nama || ""}</h2>
              <p className="text-blue-100 text-sm font-medium">{auth.roleName || ""}</p>
            </div>
            { }            <div className="absolute -right-8 -bottom-16 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          { }          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
            <h3 className="text-sm font-semibold text-gray-800 p-4 border-b border-gray-100">
              Informasi Pribadi
            </h3>
            <div className="divide-y divide-gray-50">
              <div className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <User size={18} className="text-[#0140c7]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Nama Lengkap</p>
                  <p className="text-sm font-medium text-gray-800">{auth.nama || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Briefcase size={18} className="text-[#0140c7]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Nama Pengguna</p>
                  <p className="text-sm font-medium text-gray-800">{auth.username || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Shield size={18} className="text-[#0140c7]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Peran</p>
                  <p className="text-sm font-medium text-gray-800">{auth.roleCode || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-[#0140c7]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Email</p>
                  <p className="text-sm font-medium text-gray-800">{auth.email || `${auth.username}@polytechnic.astra.ac.id`}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-[#0140c7]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">No. Telepon</p>
                  <p className="text-sm font-medium text-gray-800">{auth.noHp || "+62 812-3456-7890"}</p>
                </div>
              </div>
            </div>
          </div>

          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold py-3.5 rounded-xl border border-red-100 hover:bg-red-100 transition-colors">
            <LogOut size={18} />
            Keluar Aplikasi
          </button>
        </div>

        <BottomNav />
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
                  auth.logout();
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