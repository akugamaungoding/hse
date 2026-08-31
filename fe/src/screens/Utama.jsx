import { Link } from "react-router";
import { MobileContainer } from "../components/MobileContainer";
import { BottomNav } from "../components/BottomNav";
import { useApp } from "../context/AppContext";
import { useAuthStore } from "@/store/useAuthStore";
import { useActiveKejadian } from "@/hooks/useActiveKejadian";
import { KEJADIAN_STATUS_LABEL } from "@/constants/routes";
import { asetServices } from "@/services/asetServices";
import { useState, useEffect, useRef, useLayoutEffect, useMemo } from "react";
import {
  Shield,
  Flame,
  Droplets,
  Package,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  FileText,
  Siren,
  Calendar,
  MapPin,
  RefreshCw,
  BarChart3,
  Check,
  UserCheck,
  Radio,
  Users,
  Activity,
  HeartPulse,
  SlidersHorizontal,
  ClipboardList,
  Megaphone,
  Phone,
  ExternalLink,
  X,
} from "lucide-react";

export function Utama() {
  const {
    apars,
    hydrants,
    emergencyBoxes,
    pompas,
    apds,
  } = useApp();
  const { nama, roleName, roleCode } = useAuthStore();
  const { kejadian } = useActiveKejadian();
  const [recentInspeksi, setRecentInspeksi] = useState([]);
  const scrollContainerRef = useRef(null);

  // Civitas location state
  const [userLocation, setUserLocation] = useState("Gedung A - Lantai 2");

  // Active K3 Simulation Announcement State
  const [simulasiAnnouncement, setSimulasiAnnouncement] = useState(null);

  useEffect(() => {
    const loadSimulasi = () => {
      const saved = localStorage.getItem("SIMULASI_ANNOUNCEMENT");
      if (saved) {
        try {
          setSimulasiAnnouncement(JSON.parse(saved));
        } catch (e) {
          setSimulasiAnnouncement(null);
        }
      } else {
        setSimulasiAnnouncement(null);
      }
    };

    loadSimulasi();
    window.addEventListener("simulasi-updated", loadSimulasi);
    window.addEventListener("storage", loadSimulasi);
    return () => {
      window.removeEventListener("simulasi-updated", loadSimulasi);
      window.removeEventListener("storage", loadSimulasi);
    };
  }, []);

  const handleScroll = (e) => {
    sessionStorage.setItem("utama_scroll_pos", e.currentTarget.scrollTop);
  };

  useLayoutEffect(() => {
    const savedScroll = sessionStorage.getItem("utama_scroll_pos");
    if (savedScroll && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, [apars, hydrants, emergencyBoxes, pompas, apds, recentInspeksi]);

  useEffect(() => {
    if (["SUPER_ADMIN", "SHE_AGENT", "UNIT_K3"].includes(roleCode)) {
      asetServices
        .getRecentInspeksi(3)
        .then((res) => {
          setRecentInspeksi(
            res.map((item) => ({
              id: `INS-${item.inspeksiId}`,
              equipmentId: item.assetId,
              tanggal: new Date(item.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
              petugas: item.petugas,
              status: item.status,
            }))
          );
        })
        .catch(() => {});
    }
  }, [apars, hydrants, emergencyBoxes, pompas, apds, roleCode]);

  const aparAman = apars.filter((a) => a.status === "Aman").length;
  const hydrantAman = hydrants.filter((h) => h.status === "Aman").length;
  const eboxAman = emergencyBoxes.filter((e) => e.status === "Aman").length;
  const pompaAman = pompas.filter((p) => p.status === "Aman").length;
  const apdAman = apds.filter((a) => a.status === "Aman").length;

  const totalAman = aparAman + hydrantAman + eboxAman + pompaAman + apdAman;
  const totalAlat =
    apars.length + hydrants.length + emergencyBoxes.length + pompas.length + apds.length;
  const compliance = totalAlat > 0 ? Math.round((totalAman / totalAlat) * 100) : 100;

  // Role Category Checks
  const isAssetManager = ["SUPER_ADMIN", "SHE_AGENT", "UNIT_K3"].includes(roleCode);
  const isCivitas = roleCode === "CIVITAS";

  const [showUninspectedModal, setShowUninspectedModal] = useState(false);
  const [selectedUninspectedCategory, setSelectedUninspectedCategory] = useState("Semua");

  const allAssets = useMemo(() => {
    return [...apars, ...hydrants, ...emergencyBoxes, ...pompas, ...apds];
  }, [apars, hydrants, emergencyBoxes, pompas, apds]);

  const uninspectedAssets = useMemo(() => {
    return allAssets.filter((a) => a.status !== "Aman");
  }, [allAssets]);

  const filteredUninspectedAssets = useMemo(() => {
    if (selectedUninspectedCategory === "Semua") return uninspectedAssets;
    return uninspectedAssets.filter((a) => a.jenis === selectedUninspectedCategory);
  }, [uninspectedAssets, selectedUninspectedCategory]);

  // Replacement Plan vs Actual with Target Due Date
  const replacementData = [
    { type: "APAR", plan: 5, actual: 4, unit: "Unit", dueDate: "30 Sep 2026" },
    { type: "Emergency Box", plan: 2, actual: 2, unit: "Box", dueDate: "15 Okt 2026" },
    { type: "Hydrant Box", plan: 1, actual: 1, unit: "Unit", dueDate: "31 Okt 2026" },
    { type: "Pompa Hydrant", plan: 1, actual: 0, unit: "Unit", dueDate: "15 Nov 2026" },
    { type: "APD Box", plan: 3, actual: 3, unit: "Set", dueDate: "30 Nov 2026" },
  ];

  // Specific Role Dashboards & Task Menus
  const roleSpecificTaskNav = () => {
    switch (roleCode) {
      case "TIM_IDENTIFIKASI":
        return [
          { label: "Validasi Kejadian Darurat", to: "/petugas/validasi", icon: <UserCheck className="w-5 h-5 text-amber-600" /> },
        ];
      case "PIC_CONTROL_ROOM":
        return [
          { label: "Control Room & Broadcast Alaram", to: "/petugas/control-room", icon: <Radio className="w-5 h-5 text-[#0140c7]" /> },
        ];
      case "FLOOR_WARDEN":
        return [
          { label: "Manajemen Evakuasi Lantai", to: "/petugas/evakuasi", icon: <Users className="w-5 h-5 text-orange-600" /> },
        ];
      case "PIC_ASSEMBLY_POINT":
        return [
          { label: "Dashboard Assembly Point & Absensi", to: "/petugas/assembly-point", icon: <CheckCircle2 className="w-5 h-5 text-green-600" /> },
          { label: "Absen Scan QR / Input Manual", to: "/darurat/assembly", icon: <QrCode className="w-5 h-5 text-indigo-600" /> },
        ];
      case "TIM_P3K":
        return [
          { label: "Laporan Pertolongan Pertama (P3K)", to: "/petugas/p3k", icon: <HeartPulse className="w-5 h-5 text-red-600" /> },
        ];
      case "TIM_FIRE_FIGHTER":
        return [
          { label: "Form Laporan Pemadaman Fire Fighter", to: "/petugas/pemadaman", icon: <Flame className="w-5 h-5 text-red-600" /> },
        ];
      case "KEPALA_TKTD":
        return [
          { label: "Dashboard Koordinasi Utama TKTD", to: "/petugas/koordinasi", icon: <SlidersHorizontal className="w-5 h-5 text-[#0140c7]" /> },
          { label: "Evakuasi Lantai", to: "/petugas/evakuasi", icon: <Users className="w-5 h-5 text-orange-600" /> },
          { label: "Assembly Point", to: "/petugas/assembly-point", icon: <CheckCircle2 className="w-5 h-5 text-green-600" /> },
          { label: "Tim P3K", to: "/petugas/p3k", icon: <HeartPulse className="w-5 h-5 text-red-600" /> },
          { label: "Tim Fire Fighter", to: "/petugas/pemadaman", icon: <Flame className="w-5 h-5 text-red-600" /> },
        ];
      case "UNIT_K3":
        return [
          { label: "Pengumuman Simulasi K3", to: "/petugas/simulasi-k3", icon: <Megaphone className="w-5 h-5 text-blue-600" /> },
          { label: "Laporan Kejadian & GA Followup", to: "/petugas/laporan", icon: <ClipboardList className="w-5 h-5 text-indigo-600" /> },
          { label: "Koordinasi TKTD", to: "/petugas/koordinasi", icon: <SlidersHorizontal className="w-5 h-5 text-[#0140c7]" /> },
          { label: "Evakuasi Lantai", to: "/petugas/evakuasi", icon: <Users className="w-5 h-5 text-orange-600" /> },
          { label: "Assembly Point", to: "/petugas/assembly-point", icon: <CheckCircle2 className="w-5 h-5 text-green-600" /> },
          { label: "Tim P3K", to: "/petugas/p3k", icon: <HeartPulse className="w-5 h-5 text-red-600" /> },
          { label: "Tim Fire Fighter", to: "/petugas/pemadaman", icon: <Flame className="w-5 h-5 text-red-600" /> },
        ];
      case "GA":
        return [
          { label: "Laporan Kejadian & Follow-up GA", to: "/petugas/laporan", icon: <ClipboardList className="w-5 h-5 text-indigo-600" /> },
        ];
      default:
        return [];
    }
  };

  const roleTasks = roleSpecificTaskNav();

  return (
    <MobileContainer>
      <div className="flex flex-col h-full bg-[#f0f4ff] relative">
        <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto custom-scrollbar pb-[88px]">
          {/* Header Banner */}
          <div className="bg-[#0140c7] px-5 pt-12 pb-8 relative overflow-hidden">
            <div className="absolute w-40 h-40 rounded-full bg-white/10 -top-8 -right-8" />
            <div className="absolute w-24 h-24 rounded-full bg-white/10 bottom-0 left-1/2" />

            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-blue-200 text-xs font-medium font-['Poppins',sans-serif]">
                  Selamat datang,
                </p>
                <h1 className="text-white font-['Poppins',sans-serif] font-bold text-xl leading-tight">
                  {nama}
                </h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <Shield className="w-3.5 h-3.5 text-blue-200" />
                  <p className="text-blue-200 text-xs font-['Poppins',sans-serif] font-semibold">{roleName}</p>
                </div>
              </div>

              {/* Location Badge */}
              <div className="bg-white/20 backdrop-blur rounded-xl p-2 text-right">
                <div className="flex items-center gap-1 text-white text-[11px] font-bold">
                  <MapPin className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Lantai Civitas</span>
                </div>
                <p className="text-blue-100 text-[10px] font-semibold mt-0.5">{userLocation}</p>
              </div>
            </div>

            {/* SLA Target Banner */}
            <div className="mt-4 bg-yellow-400/20 border border-yellow-300/40 rounded-xl px-3 py-1.5 flex items-center justify-between z-10 relative">
              <span className="text-[11px] text-yellow-100 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-yellow-300" /> Target Respons TKTD:
              </span>
              <span className="text-xs font-extrabold text-yellow-300 bg-yellow-950/40 px-2 py-0.5 rounded-full">
                Maksimal 2 Menit
              </span>
            </div>

            {/* Compliance Progress (Only for Asset Managers) */}
            {isAssetManager && (
              <div className="mt-4 bg-white/15 rounded-2xl p-3 relative z-10">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-blue-100 text-xs font-medium font-['Poppins',sans-serif]">
                    Kepatuhan Inspeksi Aset
                  </p>
                  <span className="text-white font-bold text-sm font-['Poppins',sans-serif]">
                    {compliance}%
                  </span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all"
                    style={{ width: `${compliance}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Emergency Section: Push Button Emergency & Active Emergency Status */}
          <div className="px-5 -mt-4 flex flex-col gap-3 relative z-10">
            {/* Push Button Emergency (Always visible for Civitas & Super Admin) */}
            {(isCivitas || roleCode === "SUPER_ADMIN") && (
              <Link
                to="/darurat/lapor"
                className="flex items-center justify-between bg-[#e31212] text-white rounded-2xl px-5 py-4 shadow-lg shadow-red-200 active:scale-98 transition-transform border-2 border-red-400"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white text-red-600 rounded-full flex items-center justify-center shadow animate-bounce">
                    <Siren className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-['Poppins',sans-serif] font-extrabold text-base">
                      PUSH BUTTON EMERGENCY
                    </p>
                    <p className="text-red-100 text-xs font-medium">
                      Tekan untuk lapor darurat (SLA ≤ 2 Menit)
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-white" />
              </Link>
            )}

            {/* Active Emergency Alert Bar (Shown if incident active) */}
            {kejadian && (
              <Link
                to={`/darurat/status/${kejadian.kejadianId}`}
                className="flex items-center justify-between bg-amber-500 text-white rounded-2xl px-5 py-3 shadow-md animate-pulse border border-amber-400"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                    <Siren className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-['Poppins',sans-serif] font-bold text-xs">
                      Tanggap Darurat Sedang Aktif
                    </p>
                    <p className="text-amber-100 text-[11px]">
                      {KEJADIAN_STATUS_LABEL[kejadian.status] || kejadian.status} · {kejadian.lokasi}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-100" />
              </Link>
            )}

            {/* Active K3 Simulation Announcement Banner (Visible to ALL ROLES) */}
            {simulasiAnnouncement && (
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3 shadow-xs">
                <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Megaphone className="w-5 h-5 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] font-extrabold bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                      HIMBAUAN SIMULASI K3
                    </span>
                    <span className="text-[10px] text-blue-600 font-bold">HARI INI</span>
                  </div>
                  <p className="font-bold text-xs text-gray-900 mt-1">{simulasiAnnouncement.namaSimulasi}</p>
                  <p className="text-[11px] text-blue-900 mt-0.5 font-semibold">
                    Pukul <strong>{simulasiAnnouncement.jamMulai} - {simulasiAnnouncement.jamSelesai}</strong> · {simulasiAnnouncement.lokasi}
                  </p>
                  <p className="text-[10px] text-blue-800 italic mt-1 bg-white/90 p-2 rounded-lg border border-blue-100 font-medium leading-relaxed">
                    "{simulasiAnnouncement.pesan}"
                  </p>
                </div>
              </div>
            )}

            {/* Asset Stat Overview (Only for Asset Managers) */}
            {isAssetManager && (
              <div className="flex gap-3">
                <div className="flex-1 bg-white rounded-2xl shadow-sm p-3 flex flex-col items-center border border-gray-100">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mb-1" />
                  <p className="font-bold text-lg text-gray-800 font-['Poppins',sans-serif]">
                    {totalAman}
                  </p>
                  <p className="text-[10px] text-gray-500">Aset Aman</p>
                </div>

                <button
                  onClick={() => setShowUninspectedModal(true)}
                  className="flex-1 bg-amber-50 hover:bg-amber-100/80 rounded-2xl shadow-sm p-3 flex flex-col items-center border border-amber-200 active:scale-95 transition-all cursor-pointer group"
                  title="Klik untuk melihat daftar aset belum terinspeksi & jadwal"
                >
                  <AlertTriangle className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-lg text-amber-900 font-['Poppins',sans-serif]">
                    {totalAlat - totalAman}
                  </p>
                  <p className="text-[10px] text-amber-800 font-bold flex items-center gap-0.5">
                    Perlu Tindak <ChevronRight className="w-3 h-3" />
                  </p>
                </button>

                <div className="flex-1 bg-white rounded-2xl shadow-sm p-3 flex flex-col items-center border border-gray-100">
                  <Clock className="w-5 h-5 text-blue-500 mb-1" />
                  <p className="font-bold text-lg text-gray-800 font-['Poppins',sans-serif]">
                    {totalAlat}
                  </p>
                  <p className="text-[10px] text-gray-500">Total Aset</p>
                </div>
              </div>
            )}

            {/* WhatsApp Emergency Call Contact Card (Linkable) */}
            <a
              href="https://wa.me/6285156350374"
              target="_blank"
              rel="noreferrer"
              className="bg-green-50 border border-green-200 hover:border-green-300 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs transition-colors mt-1"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 font-['Poppins',sans-serif]">
                    Emergency Call (WhatsApp)
                  </p>
                  <p className="text-xs font-bold text-green-700 mt-0.5">
                    085156350374 — Shofi
                  </p>
                  <p className="text-[10px] text-gray-500">Departemen UPT Perangkat Lunak</p>
                </div>
              </div>
              <span className="text-[10px] bg-green-600 text-white font-bold px-2.5 py-1.5 rounded-xl shrink-0 shadow-xs flex items-center gap-1">
                Chat WA →
              </span>
            </a>
          </div>

          {/* Specific Role Task Menus */}
          {roleTasks.length > 0 && (
            <div className="px-5 mt-5">
              <h2 className="font-['Poppins',sans-serif] font-bold text-sm text-gray-700 mb-3">
                Menu Tugas Role ({roleName})
              </h2>
              <div className="flex flex-col gap-2.5">
                {roleTasks.map((t) => (
                  <Link
                    key={t.label}
                    to={t.to}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between active:scale-98 transition-transform"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                        {t.icon}
                      </div>
                      <span className="font-['Poppins',sans-serif] font-bold text-sm text-gray-800">
                        {t.label}
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Civitas Quick Nav (Absensi Assembly Point & Jalur Evakuasi) */}
          {isCivitas && (
            <div className="px-5 mt-5">
              <h2 className="font-['Poppins',sans-serif] font-bold text-sm text-gray-700 mb-3">
                Fitur Civitas ASTRAtech
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/darurat/assembly"
                  className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3 active:scale-95 transition-transform"
                >
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <QrCode className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <p className="font-['Poppins',sans-serif] font-bold text-xs text-gray-800">
                      Absen Assembly Point
                    </p>
                    <p className="text-[10px] font-semibold mt-0.5 text-green-700">Scan QR / Input Nama</p>
                  </div>
                </Link>

                <Link
                  to="/denah"
                  className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3 active:scale-95 transition-transform"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <MapPin className="w-7 h-7 text-[#0140c7]" />
                  </div>
                  <div>
                    <p className="font-['Poppins',sans-serif] font-bold text-xs text-gray-800">
                      Denah Jalur Evakuasi
                    </p>
                    <p className="text-[10px] font-semibold mt-0.5 text-blue-700">Jalur & Assembly Point</p>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Asset Management Feature Cards (ONLY FOR ASSET MANAGERS: SUPER_ADMIN, SHE_AGENT, UNIT_K3) */}
          {isAssetManager && (
            <div className="px-5 mt-5">
              <h2 className="font-['Poppins',sans-serif] font-bold text-sm text-gray-700 mb-3">
                Kelola Inventaris Aset (5 Kategori) & Inspeksi
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "APAR", to: "/apar", icon: <Flame className="w-7 h-7 text-[#0140c7]" />, bg: "bg-blue-50", count: `${aparAman}/${apars.length}`, sub: "Aman", subColor: "text-blue-700" },
                  { label: "Emergency Box", to: "/emergency-box", icon: <Package className="w-7 h-7 text-orange-600" />, bg: "bg-orange-50", count: `${eboxAman}/${emergencyBoxes.length}`, sub: "Aman", subColor: "text-orange-700" },
                  { label: "Hydrant Box", to: "/hydrant", icon: <Droplets className="w-7 h-7 text-green-600" />, bg: "bg-green-50", count: `${hydrantAman}/${hydrants.length}`, sub: "Aman", subColor: "text-green-700" },
                  { label: "Pompa Hydrant", to: "/pompa-hydrant", icon: <Droplets className="w-7 h-7 text-purple-600" />, bg: "bg-purple-50", count: `${pompaAman}/${pompas.length}`, sub: "Aman", subColor: "text-purple-700" },
                  { label: "Alat Pelindung (APD)", to: "/apd", icon: <Shield className="w-7 h-7 text-red-600" />, bg: "bg-red-50", count: `${apdAman}/${apds.length}`, sub: "Aman", subColor: "text-red-700" },
                ].map((f) => (
                  <Link
                    key={f.label}
                    to={f.to}
                    className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3 active:scale-95 transition-transform"
                  >
                    <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center`}>
                      {f.icon}
                    </div>
                    <div>
                      <p className="font-['Poppins',sans-serif] font-bold text-xs text-gray-800">
                        {f.label}
                      </p>
                      <p className={`text-[10px] font-semibold mt-0.5 ${f.subColor}`}>
                        {f.count ? `${f.count} ${f.sub}` : f.sub}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Dashboard Grafik Kondisi Aset (Only for Asset Managers) */}
          {isAssetManager && (
            <div className="px-5 mt-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#0140c7]" />
                    <h3 className="font-['Poppins',sans-serif] font-bold text-gray-800 text-sm">
                      Dashboard Grafik Kondisi Aset
                    </h3>
                  </div>
                  <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">
                    APAR · EB · HB · PH · APD
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 mt-1">
                  {[
                    { name: "APAR", total: apars.length, aman: aparAman, color: "bg-blue-600", rawJenis: "APAR" },
                    { name: "Emergency Box", total: emergencyBoxes.length, aman: eboxAman, color: "bg-orange-500", rawJenis: "Emergency Box" },
                    { name: "Hydrant Box", total: hydrants.length, aman: hydrantAman, color: "bg-green-600", rawJenis: "Hydrant Box" },
                    { name: "Pompa Hydrant", total: pompas.length, aman: pompaAman, color: "bg-purple-600", rawJenis: "Pompa Hydrant" },
                    { name: "APD Box", total: apds.length, aman: apdAman, color: "bg-red-500", rawJenis: "APD" },
                  ].map((item) => {
                    const notOkCount = item.total - item.aman;
                    const pct = item.total > 0 ? Math.round((item.aman / item.total) * 100) : 100;
                    return (
                      <div
                        key={item.name}
                        onClick={() => {
                          if (notOkCount > 0) {
                            setSelectedUninspectedCategory(item.rawJenis);
                            setShowUninspectedModal(true);
                          }
                        }}
                        className={`flex flex-col gap-1 p-2.5 rounded-xl transition-all ${
                          notOkCount > 0
                            ? "bg-amber-50/70 border border-amber-200 hover:border-amber-400 cursor-pointer shadow-2xs group"
                            : "bg-gray-50/50 border border-gray-100"
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-semibold text-gray-700">
                          <span className="font-bold text-gray-900 font-['Poppins',sans-serif]">{item.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-gray-500 font-medium">
                              {item.aman}/{item.total} OK ({pct}%)
                            </span>
                            {notOkCount > 0 && (
                              <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-0.5 group-hover:bg-amber-200 transition-colors">
                                ⚠️ {notOkCount} Belum OK <ChevronRight className="w-3 h-3 text-amber-700" />
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mt-0.5">
                          <div
                            className={`h-full rounded-full transition-all ${item.color}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Kebutuhan Penggantian Aset: Plan vs Actual (Only for Asset Managers) */}
          {isAssetManager && (
            <div className="px-5 mt-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3.5">
                {/* Centered Header Section with Target 2026 Badge */}
                <div className="flex flex-col items-center text-center gap-1 border-b border-gray-100 pb-2.5">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-['Poppins',sans-serif] font-bold text-gray-800 text-sm">
                      Kebutuhan Penggantian Aset
                    </h3>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Target 2026
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Monitoring Realisasi Plan vs Actual & Target Selesai
                  </p>
                </div>

                {/* Replacement Progress Cards List */}
                <div className="flex flex-col gap-2.5">
                  {replacementData.map((r) => {
                    const isComplete = r.actual >= r.plan;
                    const pct = r.plan > 0 ? Math.round((r.actual / r.plan) * 100) : 100;
                    return (
                      <div
                        key={r.type}
                        className="p-3 bg-gray-50/80 rounded-xl border border-gray-200/80 flex flex-col gap-2 hover:border-indigo-200 transition-colors shadow-2xs"
                      >
                        {/* Top Info: Asset Category & Target Due Date Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-gray-900 font-['Poppins',sans-serif]">
                            {r.type}
                          </span>

                          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-indigo-100 shadow-2xs">
                            <Calendar className="w-3 h-3 text-indigo-600" />
                            <span className="text-[10px] font-extrabold text-indigo-900">
                              Target Due Date: <span className="text-indigo-600">{r.dueDate}</span>
                            </span>
                          </div>
                        </div>

                        {/* Middle Info: Plan vs Actual Qty & Progress Bar */}
                        <div className="flex flex-col gap-1 mt-0.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-gray-500 font-medium">
                              Realisasi: <strong className="text-gray-800">{r.actual}</strong> dari <strong>{r.plan} {r.unit}</strong>
                            </span>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                isComplete
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : "bg-amber-100 text-amber-800 border border-amber-200"
                              }`}
                            >
                              {isComplete ? "✓ Sesuai Target" : `Sisa ${r.plan - r.actual} ${r.unit}`}
                            </span>
                          </div>

                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isComplete ? "bg-green-500" : "bg-indigo-600"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Super Admin Panel */}
          {roleCode === "SUPER_ADMIN" && (
            <div className="px-5 mt-5">
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-5 shadow-lg text-white">
                <h3 className="font-['Poppins',sans-serif] font-bold text-sm mb-1">Super Admin Panel</h3>
                <p className="text-[10px] text-blue-100 mb-4">Akses cepat seluruh dashboard petugas tanggap darurat</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Validasi Kejadian (Tim Identifikasi)", to: "/petugas/validasi" },
                    { label: "Control Room Dashboard (PIC Control Room)", to: "/petugas/control-room" },
                    { label: "Evakuasi Lantai (Floor Warden)", to: "/petugas/evakuasi" },
                    { label: "Assembly Point (PIC Assembly Point)", to: "/petugas/assembly-point" },
                    { label: "Pertolongan Pertama (Tim P3K)", to: "/petugas/p3k" },
                    { label: "Fire Fighter (Tim Fire Fighter)", to: "/petugas/pemadaman" },
                    { label: "Koordinasi (Kepala TKTD)", to: "/petugas/koordinasi" },
                    { label: "Laporan Kejadian (Unit K3 / GA)", to: "/petugas/laporan" },
                  ].map((p, idx) => (
                    <Link
                      key={idx}
                      to={p.to}
                      className="bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center justify-between"
                    >
                      <span>{p.label}</span>
                      <ChevronRight size={14} className="text-blue-200" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Inspeksi Terbaru (Asset Managers Only) */}
          {isAssetManager && (
            <div className="px-5 mt-5 mb-4">
              <h2 className="font-['Poppins',sans-serif] font-bold text-sm text-gray-700 mb-3">
                Aktivitas Inspeksi Terbaru
              </h2>
              <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50">
                {recentInspeksi.length === 0 ? (
                  <p className="text-center text-xs text-gray-400 py-6">Belum ada aktivitas</p>
                ) : (
                  recentInspeksi.map((rec) => (
                    <div key={rec.id} className="flex items-start gap-3 p-4">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          rec.status === "Aman" ? "bg-green-100" : "bg-yellow-100"
                        }`}
                      >
                        <FileText
                          className={`w-4 h-4 ${
                            rec.status === "Aman" ? "text-green-600" : "text-yellow-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">
                          Inspeksi {rec.equipmentId} selesai
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {rec.petugas} · {rec.tanggal}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          rec.status === "Aman"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal List Aset Belum Terinspeksi & Jadwal Inspeksi */}
        {showUninspectedModal && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-3.5 bg-white border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Detail Aset Belum OK & Jadwal
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Menampilkan {filteredUninspectedAssets.length} dari {uninspectedAssets.length} aset perlu tindak lanjut
                  </p>
                </div>
                <button
                  onClick={() => setShowUninspectedModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="p-2.5 bg-gray-50 border-b border-gray-200 flex overflow-x-auto gap-1.5 no-scrollbar shrink-0">
                {["Semua", "APAR", "Emergency Box", "Hydrant Box", "Pompa Hydrant", "APD"].map((cat) => {
                  const isActive = selectedUninspectedCategory === cat;
                  const count = cat === "Semua" ? uninspectedAssets.length : uninspectedAssets.filter((a) => a.jenis === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedUninspectedCategory(cat)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg shrink-0 transition-all flex items-center gap-1 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                          isActive ? "bg-white/25 text-white" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Assets List */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 custom-scrollbar">
                {filteredUninspectedAssets.length === 0 ? (
                  <div className="py-10 text-center flex flex-col items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                    <p className="font-bold text-xs text-gray-800">Semua Aset Kategori Ini Aman</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Tidak ada aset yang perlu perbaikan / inspeksi ulang.</p>
                  </div>
                ) : (
                  filteredUninspectedAssets.map((asset) => {
                    const routePrefix =
                      asset.tipeRaw === "HYDRANT_BOX"
                        ? "hydrant"
                        : asset.tipeRaw === "EMERGENCY_BOX"
                        ? "emergency-box"
                        : asset.tipeRaw === "POMPA_HYDRANT"
                        ? "pompa-hydrant"
                        : asset.tipeRaw === "APD"
                        ? "apd"
                        : "apar";

                    return (
                      <div
                        key={asset.id}
                        className="p-3 bg-white border border-amber-200 rounded-xl flex flex-col gap-2 shadow-xs hover:border-amber-400 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-gray-900 font-['Poppins',sans-serif]">{asset.id}</span>
                            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">
                              {asset.jenis}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              asset.status === "Rusak"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {asset.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs border-t border-gray-100 pt-2">
                          <div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase">LOKASI / AREA:</p>
                            <p className="font-semibold text-gray-800 text-[11px] flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" /> {asset.lokasi}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] text-gray-400 font-bold uppercase">JADWAL INSPEKSI SEHARUSNYA:</p>
                            <p className="font-bold text-amber-800 text-[11px] mt-0.5">{asset.jadwalInspeksi}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 mt-1">
                          <Link
                            to={`/${routePrefix}/${asset.id}/inspeksi`}
                            onClick={() => setShowUninspectedModal(false)}
                            className="px-3 py-1.5 bg-[#0b5cff] hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 transition-colors shadow-xs"
                          >
                            Inspeksi Sekarang <ChevronRight size={13} />
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </MobileContainer>
  );
}
