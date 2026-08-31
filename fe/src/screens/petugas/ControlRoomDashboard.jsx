import { useCallback, useEffect, useRef, useState } from "react";
import { PetugasLayout } from "../../components/PetugasLayout";
import { Megaphone, ShieldCheck, AlertTriangle, Clock, MapPin, Radio, Search, UserCheck, History, Filter } from "lucide-react";
import { kejadianServices } from "@/services/kejadianServices";
import { KEJADIAN_STATUS_LABEL } from "@/constants/routes";

const POLL_MS = 6000;
const SEDANG_BERJALAN_STATUS = ["Diumumkan", "Evakuasi", "Assembly Point", "Penanganan"];

function fmtTime(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  const dateStr = d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }) + " WIB";
  return `${dateStr} · ${timeStr}`;
}

function StatusPill({ status }) {
  const label = KEJADIAN_STATUS_LABEL[status] || status;
  const color =
    status === "Diumumkan"
      ? "bg-red-100 text-red-700"
      : status === "Evakuasi"
      ? "bg-yellow-100 text-yellow-700"
      : status === "Assembly Point"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-blue-100 text-blue-700";
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}>
      {label}
    </span>
  );
}

export function ControlRoomDashboard() {
  const [kejadianList, setKejadianList] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState("");
  const [actionState, setActionState] = useState({});
  const mountedRef = useRef(true);

  // Badge Filter State
  const [badgeFilter, setBadgeFilter] = useState("");

  // Role History Tracking Mock Data
  const roleHistoryLog = [
    { role: "TIM_IDENTIFIKASI", name: "Bpk. Andi (Badge #1002)", action: "Validasi Kejadian Kebakaran", time: "14:02 WIB" },
    { role: "PIC_CONTROL_ROOM", name: "Ibu Rina (Badge #1003)", action: "Umumkan Evakuasi Seluruh Gedung", time: "14:03 WIB" },
    { role: "FLOOR_WARDEN", name: "Ahmad (Badge #1004)", action: "Evakuasi Lantai 2 Selesai", time: "14:05 WIB" },
    { role: "TIM_FIRE_FIGHTER", name: "Tim Damkar (Badge #1008)", action: "Pemadaman Api Skala Kecil Selesai", time: "14:08 WIB" },
    { role: "PIC_ASSEMBLY_POINT", name: "Budi (Badge #1005)", action: "Absensi AP-01 Lengkap (Free Text & Scan)", time: "14:10 WIB" },
  ];

  const load = useCallback(() => {
    return kejadianServices
      .getAll({ pageSize: 50 })
      .then((res) => {
        if (mountedRef.current) {
          setKejadianList(Array.isArray(res?.data) ? res.data : []);
          setListError("");
        }
      })
      .catch(() => {
        if (mountedRef.current) setListError("Gagal memuat daftar kejadian.");
      })
      .finally(() => {
        if (mountedRef.current) setLoadingList(false);
      });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    load();
    const t = setInterval(load, POLL_MS);
    return () => {
      mountedRef.current = false;
      clearInterval(t);
    };
  }, [load]);

  // Filter incidents by badge / pelapor / code
  const filteredKejadianList = kejadianList.filter((k) => {
    if (!badgeFilter.trim()) return true;
    const term = badgeFilter.toLowerCase();
    return (
      k.kodeKejadian?.toLowerCase().includes(term) ||
      k.dilaporkanOlehNama?.toLowerCase().includes(term) ||
      k.lokasi?.toLowerCase().includes(term)
    );
  });

  const filteredRoleHistory = roleHistoryLog.filter((log) => {
    if (!badgeFilter.trim()) return true;
    const term = badgeFilter.toLowerCase();
    return (
      log.name.toLowerCase().includes(term) ||
      log.role.toLowerCase().includes(term) ||
      log.action.toLowerCase().includes(term)
    );
  });

  const menungguDarurat = filteredKejadianList.filter((k) => k.status === "Tervalidasi");
  const sedangBerjalan = filteredKejadianList.filter((k) => SEDANG_BERJALAN_STATUS.includes(k.status));
  const menungguAman = filteredKejadianList.filter((k) => k.status === "Aman");

  const setCardState = (id, patch) => {
    setActionState((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const handleArm = (id) => {
    setCardState(id, { arming: true, error: "" });
  };

  const handleCancelArm = (id) => {
    setCardState(id, { arming: false, error: "" });
  };

  const handlePengumumanDarurat = async (id) => {
    setCardState(id, { loading: true, error: "" });
    try {
      await kejadianServices.pengumumanDarurat(id);
      setCardState(id, { loading: false, arming: false, error: "" });
      await load();
    } catch (err) {
      setCardState(id, {
        loading: false,
        error: err.response?.data?.message || "Gagal mengumumkan darurat. Silakan coba lagi.",
      });
    }
  };

  const handlePengumumanAman = async (id) => {
    setCardState(id, { loading: true, error: "" });
    try {
      await kejadianServices.pengumumanAman(id);
      setCardState(id, { loading: false, arming: false, error: "" });
      await load();
    } catch (err) {
      setCardState(id, {
        loading: false,
        error: err.response?.data?.message || "Gagal mengumumkan kondisi aman. Silakan coba lagi.",
      });
    }
  };

  return (
    <PetugasLayout title="Control Room" subtitle="PIC Control Room (Badge Filter & Track Histori)">
      {/* Badge Search & Filter Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-700 font-['Poppins',sans-serif] flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-[#0140c7]" /> Filter Berdasarkan Badge / Nama / Kode
        </label>
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 h-10 gap-2">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari badge (contoh: #1002, Andi, AP-01)..."
            value={badgeFilter}
            onChange={(e) => setBadgeFilter(e.target.value)}
            className="flex-1 outline-none text-xs bg-transparent font-['Poppins',sans-serif]"
          />
          {badgeFilter && (
            <button onClick={() => setBadgeFilter("")} className="text-xs text-gray-400 font-bold">
              Clear
            </button>
          )}
        </div>
      </div>

      {listError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <p className="text-xs text-red-700 font-medium">{listError}</p>
        </div>
      )}

      {loadingList && kejadianList.length === 0 && !listError && (
        <div className="flex flex-col items-center justify-center gap-3 py-10">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-[#0140c7] rounded-full animate-spin" />
          <p className="text-xs text-gray-500">Memuat data kejadian...</p>
        </div>
      )}

      {/* Section 1: Menunggu Pengumuman Darurat */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-[#e31212]" />
          <h2 className="font-bold text-sm text-gray-800">Menunggu Pengumuman Darurat</h2>
        </div>

        {menungguDarurat.length === 0 && !loadingList ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-400">Tidak ada kejadian menunggu pengumuman darurat.</p>
          </div>
        ) : (
          menungguDarurat.map((k) => {
            const state = actionState[k.kejadianId] || {};
            return (
              <div key={k.kejadianId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs font-bold text-gray-500 tracking-wider">{k.kodeKejadian}</p>
                    <p className="font-bold text-sm text-gray-800 mt-0.5">{k.jenisKejadian}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 shrink-0">
                    {KEJADIAN_STATUS_LABEL[k.status] || k.status}
                  </span>
                </div>

                <div className="flex flex-col gap-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{k.lokasi}</span>
                  </div>
                  {k.waktuValidasi && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>Divalidasi {fmtTime(k.waktuValidasi)}</span>
                    </div>
                  )}
                </div>

                {k.catatanValidasi && (
                  <p className="text-xs text-gray-600 bg-gray-50 rounded-xl p-3">{k.catatanValidasi}</p>
                )}

                {state.arming && (
                  <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-3">
                    <p className="text-xs font-bold text-yellow-800">
                      Konfirmasi pengumuman darurat ke seluruh gedung?
                    </p>
                    <p className="text-[10px] text-yellow-600 mt-1">Klik tombol sekali lagi untuk mengumumkan.</p>
                  </div>
                )}

                {state.error && <p className="text-xs text-red-600 font-medium">{state.error}</p>}

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={state.loading}
                    onClick={() => (state.arming ? handlePengumumanDarurat(k.kejadianId) : handleArm(k.kejadianId))}
                    className={`flex-1 text-white rounded-xl h-12 flex items-center justify-center font-bold text-sm shadow-md gap-2 transition-all disabled:opacity-70 ${
                      state.arming ? "bg-[#e31212] shadow-red-300 animate-pulse" : "bg-[#e31212] shadow-red-200"
                    }`}
                  >
                    {state.loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Mengumumkan...
                      </>
                    ) : (
                      <>
                        <Megaphone className="w-4 h-4" />
                        {state.arming ? "KONFIRMASI PENGUMUMAN" : "Umumkan Darurat ke Seluruh Gedung"}
                      </>
                    )}
                  </button>
                  {state.arming && !state.loading && (
                    <button
                      type="button"
                      onClick={() => handleCancelArm(k.kejadianId)}
                      className="px-4 rounded-xl border border-gray-200 text-gray-500 text-xs font-bold"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Section 2: Sedang Berjalan */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#0140c7]" />
          <h2 className="font-bold text-sm text-gray-800">Sedang Berjalan</h2>
        </div>

        {sedangBerjalan.length === 0 && !loadingList ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-400">Tidak ada kejadian yang sedang berjalan.</p>
          </div>
        ) : (
          sedangBerjalan.map((k) => (
            <div key={k.kejadianId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-xs font-bold text-gray-500 tracking-wider">{k.kodeKejadian}</p>
                  <p className="font-bold text-sm text-gray-800 mt-0.5">{k.jenisKejadian}</p>
                </div>
                <StatusPill status={k.status} />
              </div>
              <div className="flex flex-col gap-1 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{k.lokasi}</span>
                </div>
                {k.waktuPengumumanDarurat && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>Diumumkan {fmtTime(k.waktuPengumumanDarurat)}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </section>

      {/* Section 3: Track Histori Status TKTD untuk Semua Role */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600" />
          <h2 className="font-bold text-sm text-gray-800">Track Histori Status TKTD (Semua Role)</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2">
          {filteredRoleHistory.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">Tidak ada riwayat untuk badge ini.</p>
          ) : (
            filteredRoleHistory.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 py-2 border-b border-gray-50 last:border-0 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0 font-['Poppins',sans-serif]">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">{item.name}</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">
                      {item.role}
                    </span>
                  </div>
                  <p className="text-gray-600 text-[11px] mt-0.5">{item.action}</p>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">{item.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Section 4: Menunggu Pengumuman Aman */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <h2 className="font-bold text-sm text-gray-800">Menunggu Pengumuman Aman</h2>
        </div>

        {menungguAman.length === 0 && !loadingList ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-400">Tidak ada kejadian menunggu pengumuman aman.</p>
          </div>
        ) : (
          menungguAman.map((k) => {
            const state = actionState[k.kejadianId] || {};
            return (
              <div key={k.kejadianId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs font-bold text-gray-500 tracking-wider">{k.kodeKejadian}</p>
                    <p className="font-bold text-sm text-gray-800 mt-0.5">{k.jenisKejadian}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0">
                    {KEJADIAN_STATUS_LABEL[k.status] || k.status}
                  </span>
                </div>

                <div className="flex flex-col gap-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{k.lokasi}</span>
                  </div>
                  {k.waktuDitetapkanAman && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>Ditetapkan aman {fmtTime(k.waktuDitetapkanAman)}</span>
                    </div>
                  )}
                </div>

                {state.arming && (
                  <div className="bg-green-50 border border-green-300 rounded-xl p-3">
                    <p className="text-xs font-bold text-green-800">
                      Konfirmasi pengumuman kondisi aman ke seluruh gedung?
                    </p>
                    <p className="text-[10px] text-green-600 mt-1">Klik tombol sekali lagi untuk mengumumkan.</p>
                  </div>
                )}

                {state.error && <p className="text-xs text-red-600 font-medium">{state.error}</p>}

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={state.loading}
                    onClick={() => (state.arming ? handlePengumumanAman(k.kejadianId) : handleArm(k.kejadianId))}
                    className={`flex-1 text-white rounded-xl h-12 flex items-center justify-center font-bold text-sm shadow-md gap-2 transition-all disabled:opacity-70 ${
                      state.arming ? "bg-green-600 shadow-green-300 animate-pulse" : "bg-green-600 shadow-green-200"
                    }`}
                  >
                    {state.loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Mengumumkan...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        {state.arming ? "KONFIRMASI PENGUMUMAN" : "Umumkan Kondisi Aman"}
                      </>
                    )}
                  </button>
                  {state.arming && !state.loading && (
                    <button
                      type="button"
                      onClick={() => handleCancelArm(k.kejadianId)}
                      className="px-4 rounded-xl border border-gray-200 text-gray-500 text-xs font-bold"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>
    </PetugasLayout>
  );
}
