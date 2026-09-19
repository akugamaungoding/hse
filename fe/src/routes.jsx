import { createBrowserRouter } from "react-router";
import { RoleGuard } from "./components/RoleGuard";

import { Splash } from "./screens/Splash";
import { Login } from "./screens/Login";

import { Utama } from "./screens/Utama";
import { Denah } from "./screens/Denah";
import { Profil } from "./screens/Profil";
import { Notifikasi } from "./screens/Notifikasi";

import { AparList } from "./screens/AparList";
import { AparDetail } from "./screens/AparDetail";
import { AparInspeksi } from "./screens/AparInspeksi";
import { AparRiwayat } from "./screens/AparRiwayat";
import { HydrantList } from "./screens/HydrantList";
import { EmergencyBoxList } from "./screens/EmergencyBoxList";
import { PompaList } from "./screens/PompaList";
import { ApdList } from "./screens/ApdList";
import { ScanQR } from "./screens/ScanQR";

import { LaporanDarurat } from "./screens/darurat/LaporanDarurat";
import { StatusDarurat } from "./screens/darurat/StatusDarurat";
import { AbsensiAssembly } from "./screens/darurat/AbsensiAssembly";

import { ValidasiKejadian } from "./screens/petugas/ValidasiKejadian";
import { ControlRoomDashboard } from "./screens/petugas/ControlRoomDashboard";
import { EvakuasiLantai } from "./screens/petugas/EvakuasiLantai";
import { AssemblyPointDashboard } from "./screens/petugas/AssemblyPointDashboard";
import { P3KForm } from "./screens/petugas/P3KForm";
import { PemadamanForm } from "./screens/petugas/PemadamanForm";
import { KoordinasiDashboard } from "./screens/petugas/KoordinasiDashboard";
import { LaporanKejadian } from "./screens/petugas/LaporanKejadian";
import { SimulasiK3Form } from "./screens/petugas/SimulasiK3Form";

const ALL_USERS = [
  "SUPER_ADMIN",
  "CIVITAS",
  "TIM_IDENTIFIKASI",
  "PIC_CONTROL_ROOM",
  "FLOOR_WARDEN",
  "PIC_ASSEMBLY_POINT",
  "TIM_P3K",
  "TIM_FIRE_FIGHTER",
  "PIC_RUANG_POMPA",
  "KEPALA_TKTD",
  "UNIT_K3",
  "GA",
  "SHE_AGENT",
];

// Strict Asset Managers: Only SUPER_ADMIN, SHE_AGENT, and UNIT_K3
const ASSET_MANAGERS = ["SUPER_ADMIN", "SHE_AGENT", "UNIT_K3"];

function GlobalErrorBoundary() {
  return (
    <div className="min-h-screen bg-red-50 p-6 flex flex-col items-center justify-center text-center font-['Poppins',sans-serif]">
      <div className="bg-white rounded-3xl p-6 shadow-xl max-w-sm w-full flex flex-col items-center gap-4 border border-red-100">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl font-bold">
          ⚠️
        </div>
        <h2 className="font-bold text-lg text-gray-800">Terjadi Kesalahan Aplikasi</h2>
        <p className="text-xs text-gray-500">
          Sistem mengalami kendala saat memuat halaman ini. Silakan kembali ke menu utama.
        </p>
        <a
          href="/utama"
          className="w-full py-3 bg-[#0140c7] text-white rounded-xl font-bold text-xs shadow-md shadow-blue-200"
        >
          Kembali ke Menu Utama
        </a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  { path: "/", Component: Splash, errorElement: <GlobalErrorBoundary /> },
  { path: "/login", Component: Login, errorElement: <GlobalErrorBoundary /> },

  // Base Screens (Accessible according to matrix)
  { path: "/utama", element: <RoleGuard allowedRoles={ALL_USERS}><Utama /></RoleGuard>, errorElement: <GlobalErrorBoundary /> },
  { path: "/denah", element: <RoleGuard allowedRoles={ALL_USERS}><Denah /></RoleGuard> },
  { path: "/profil", element: <RoleGuard allowedRoles={ALL_USERS}><Profil /></RoleGuard> },
  { path: "/notifikasi", element: <RoleGuard allowedRoles={ALL_USERS}><Notifikasi /></RoleGuard> },

  // Asset Management & Inspection Screens (Strict: SUPER_ADMIN, SHE_AGENT, UNIT_K3)
  { path: "/apar", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><AparList /></RoleGuard> },
  { path: "/apar/scan", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><ScanQR /></RoleGuard> },
  { path: "/apar/:id", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><AparDetail /></RoleGuard> },
  { path: "/apar/:id/inspeksi", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><AparInspeksi /></RoleGuard> },
  { path: "/apar/:id/riwayat", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><AparRiwayat /></RoleGuard> },

  { path: "/hydrant", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><HydrantList /></RoleGuard> },
  { path: "/hydrant/scan", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><ScanQR /></RoleGuard> },
  { path: "/hydrant/:id", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><AparDetail /></RoleGuard> },
  { path: "/hydrant/:id/inspeksi", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><AparInspeksi /></RoleGuard> },
  { path: "/hydrant/:id/riwayat", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><AparRiwayat /></RoleGuard> },

  { path: "/pompa-hydrant", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><PompaList /></RoleGuard> },
  { path: "/pompa-hydrant/scan", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><ScanQR /></RoleGuard> },
  { path: "/pompa-hydrant/:id", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><AparDetail /></RoleGuard> },
  { path: "/pompa-hydrant/:id/inspeksi", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><AparInspeksi /></RoleGuard> },
  { path: "/pompa-hydrant/:id/riwayat", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><AparRiwayat /></RoleGuard> },

  { path: "/emergency-box", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><EmergencyBoxList /></RoleGuard> },
  { path: "/emergency-box/scan", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><ScanQR /></RoleGuard> },
  { path: "/emergency-box/:id", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><AparDetail /></RoleGuard> },
  { path: "/emergency-box/:id/inspeksi", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><AparInspeksi /></RoleGuard> },
  { path: "/emergency-box/:id/riwayat", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><AparRiwayat /></RoleGuard> },

  { path: "/apd", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><ApdList /></RoleGuard> },
  { path: "/apd/scan", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><ScanQR /></RoleGuard> },
  { path: "/apd/:id", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><AparDetail /></RoleGuard> },
  { path: "/apd/:id/inspeksi", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><AparInspeksi /></RoleGuard> },
  { path: "/apd/:id/riwayat", element: <RoleGuard allowedRoles={ASSET_MANAGERS}><AparRiwayat /></RoleGuard> },

  // Emergency Incident Flow
  { path: "/darurat/lapor", element: <RoleGuard allowedRoles={["CIVITAS", "SUPER_ADMIN"]}><LaporanDarurat /></RoleGuard> },
  { path: "/darurat/status/:id", element: <RoleGuard allowedRoles={ALL_USERS}><StatusDarurat /></RoleGuard> },
  { path: "/darurat/assembly", element: <RoleGuard allowedRoles={["CIVITAS", "PIC_ASSEMBLY_POINT", "SUPER_ADMIN"]}><AbsensiAssembly /></RoleGuard> },

  // Specific Role Task Dashboards (Strict Access Control)
  { path: "/petugas/validasi", element: <RoleGuard allowedRoles={["TIM_IDENTIFIKASI", "UNIT_K3", "SUPER_ADMIN"]}><ValidasiKejadian /></RoleGuard> },
  { path: "/petugas/control-room", element: <RoleGuard allowedRoles={["PIC_CONTROL_ROOM", "UNIT_K3", "SUPER_ADMIN"]}><ControlRoomDashboard /></RoleGuard> },
  { path: "/petugas/evakuasi", element: <RoleGuard allowedRoles={["FLOOR_WARDEN", "KEPALA_TKTD", "UNIT_K3", "SUPER_ADMIN"]}><EvakuasiLantai /></RoleGuard> },
  { path: "/petugas/assembly-point", element: <RoleGuard allowedRoles={["PIC_ASSEMBLY_POINT", "KEPALA_TKTD", "UNIT_K3", "SUPER_ADMIN"]}><AssemblyPointDashboard /></RoleGuard> },
  { path: "/petugas/p3k", element: <RoleGuard allowedRoles={["TIM_P3K", "KEPALA_TKTD", "UNIT_K3", "SUPER_ADMIN"]}><P3KForm /></RoleGuard> },
  { path: "/petugas/pemadaman", element: <RoleGuard allowedRoles={["TIM_FIRE_FIGHTER", "PIC_RUANG_POMPA", "KEPALA_TKTD", "UNIT_K3", "SUPER_ADMIN"]}><PemadamanForm /></RoleGuard> },
  { path: "/petugas/koordinasi", element: <RoleGuard allowedRoles={["KEPALA_TKTD", "UNIT_K3", "SUPER_ADMIN"]}><KoordinasiDashboard /></RoleGuard> },
  { path: "/petugas/laporan", element: <RoleGuard allowedRoles={["UNIT_K3", "GA", "SUPER_ADMIN"]}><LaporanKejadian /></RoleGuard> },
  { path: "/petugas/simulasi-k3", element: <RoleGuard allowedRoles={["UNIT_K3", "SUPER_ADMIN"]}><SimulasiK3Form /></RoleGuard> },
]);
