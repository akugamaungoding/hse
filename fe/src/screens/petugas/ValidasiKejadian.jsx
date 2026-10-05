import { useEffect, useState } from "react";
import { PetugasLayout } from "../../components/PetugasLayout";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  User,
  Flame,
  Search,
  ChevronDown,
  ChevronUp,
  Shield,
  Activity,
  History,
  AlertTriangle
} from "lucide-react";
import { kejadianServices } from "@/services/kejadianServices";
import { KEJADIAN_STATUS_LABEL } from "@/constants/routes";

export function fmtWaktu(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  const jam = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
  const tanggal = d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  return `${tanggal}, ${jam}`;
}

const STEPS = [
  { key: "Menunggu Validasi", label: "Laporan Terkirim", getWaktu: d => d?.waktuLapor },
  { key: "Tervalidasi", label: "Divalidasi Tim Identifikasi", getWaktu: d => d?.waktuValidasi },
  { key: "Diumumkan", label: "Diumumkan Control Room", getWaktu: d => d?.waktuPengumumanDarurat },
  { key: "Evakuasi", label: "Proses Evakuasi", getWaktu: d => d?.waktuEvakuasi },
  { key: "Assembly Point", label: "Pendataan Titik Kumpul", getWaktu: d => d?.waktuAssembly },
  { key: "Penanganan", label: "Penanganan oleh Petugas", getWaktu: d => d?.waktuPenanganan },
  { key: "Aman", label: "Kondisi Dinyatakan Aman", getWaktu: d => d?.waktuPengumumanAman },
  { key: "Selesai", label: "Laporan Ditutup", getWaktu: d => d?.waktuSelesai },
];

export function ValidasiKejadian() {
  const [activeTab, setActiveTab] = useState("MENUNGGU"); // 'MENUNGGU' | 'BERJALAN' | 'RIWAYAT'
  const [daftarAll, setDaftarAll] = useState([]);
  const [loadingAwal, setLoadingAwal] = useState(true);
  const [errorAwal, setErrorAwal] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [filterJenis, setFilterJenis] = useState("SEMUA");

  // Form states per item
  const [catatanMap, setCatatanMap] = useState({});
  const [aksiMap, setAksiMap] = useState({});
  const [expandedTimeline, setExpandedTimeline] = useState({});

  // Confirmation Modal State
  const [modalConfig, setModalConfig] = useState(null); // { kejadian, hasilValidasi: boolean, skala: 'Kecil' | 'Sedang' | 'Besar' }

  const loadData = () => {
    kejadianServices
      .getAll({ pageSize: 100, urut: "terbaru" })
      .then(res => {
        setDaftarAll(res?.data || []);
        setErrorAwal("");
      })
      .catch(() => {
        setErrorAwal("Gagal memuat data laporan.");
      })
      .finally(() => {
        setLoadingAwal(false);
      });
  };

  useEffect(() => {
    let mounted = true;
    loadData();
    const t = setInterval(() => {
      if (mounted) loadData();
    }, 8000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, []);

  // Filter items by tab
  const daftarMenunggu = daftarAll.filter(k => k.status === "Menunggu Validasi");
  const daftarBerjalan = daftarAll.filter(
    k => ["Tervalidasi", "Diumumkan", "Evakuasi", "Assembly Point", "Penanganan"].includes(k.status)
  );
  const daftarRiwayat = daftarAll.filter(k => ["Aman", "Selesai", "Bukan Darurat"].includes(k.status));

  const getCurrentList = () => {
    if (activeTab === "MENUNGGU") return daftarMenunggu;
    if (activeTab === "BERJALAN") return daftarBerjalan;
    return daftarRiwayat;
  };

  const filteredList = getCurrentList().filter(k => {
    const matchQuery =
      filterQuery === "" ||
      (k.kodeKejadian || "").toLowerCase().includes(filterQuery.toLowerCase()) ||
      (k.jenisKejadian || "").toLowerCase().includes(filterQuery.toLowerCase()) ||
      (k.lokasi || "").toLowerCase().includes(filterQuery.toLowerCase()) ||
      (k.deskripsi || "").toLowerCase().includes(filterQuery.toLowerCase());
    const matchJenis =
      filterJenis === "SEMUA" ||
      (filterJenis === "KEBAKARAN" && (k.jenisKejadian || "").toLowerCase().includes("kebakaran")) ||
      (filterJenis === "GEMPA" && (k.jenisKejadian || "").toLowerCase().includes("gempa"));
    return matchQuery && matchJenis;
  });

  const openValidasiModal = (kejadian, hasilValidasi) => {
    setModalConfig({
      kejadian,
      hasilValidasi,
      skala: "Kecil", // Default skala
      catatan: catatanMap[kejadian.kejadianId] || "",
    });
  };

  const handleValidasiSubmit = async () => {
    if (!modalConfig) return;
    const { kejadian, hasilValidasi, skala, catatan } = modalConfig;
    const id = kejadian.kejadianId;

    setAksiMap(prev => ({ ...prev, [id]: { loading: true, error: "" } }));
    setModalConfig(null);

    try {
      await kejadianServices.validasi(id, {
        hasilValidasi,
        catatan: catatan ? `[Skala: ${skala}] ${catatan}` : `[Skala: ${skala}]`,
      });
      loadData();
      setAksiMap(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Validasi gagal dikirim. Silakan coba lagi.";
      setAksiMap(prev => ({ ...prev, [id]: { loading: false, error: msg } }));
    }
  };

  const toggleTimeline = id => {
    setExpandedTimeline(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <PetugasLayout title="Validasi Kejadian" subtitle="Tim Identifikasi Kejadian Darurat">
      {/* Tab Navigasi Kategori */}
      <div className="flex bg-gray-100 p-1 rounded-2xl gap-1 mb-2">
        <button
          type="button"
          onClick={() => setActiveTab("MENUNGGU")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-['Poppins',sans-serif] flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "MENUNGGU" ? "bg-white text-[#0140c7] shadow-xs" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Menunggu</span>
          {daftarMenunggu.length > 0 && (
            <span className="bg-red-500 text-white px-1.5 py-0.2 text-[10px] rounded-full font-mono">
              {daftarMenunggu.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("BERJALAN")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-['Poppins',sans-serif] flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "BERJALAN" ? "bg-white text-[#0140c7] shadow-xs" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Sedang Berjalan</span>
          {daftarBerjalan.length > 0 && (
            <span className="bg-blue-600 text-white px-1.5 py-0.2 text-[10px] rounded-full font-mono">
              {daftarBerjalan.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("RIWAYAT")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-['Poppins',sans-serif] flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "RIWAYAT" ? "bg-white text-[#0140c7] shadow-xs" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Riwayat</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex flex-col gap-2">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari kode, lokasi, jenis..."
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-['Poppins',sans-serif] outline-none focus:border-[#0140c7]"
          />
        </div>

        <div className="flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => setFilterJenis("SEMUA")}
            className={`px-3 py-1 rounded-lg font-bold font-['Poppins',sans-serif] transition-colors ${
              filterJenis === "SEMUA" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Semua Tipe
          </button>
          <button
            type="button"
            onClick={() => setFilterJenis("KEBAKARAN")}
            className={`px-3 py-1 rounded-lg font-bold font-['Poppins',sans-serif] flex items-center gap-1 transition-colors ${
              filterJenis === "KEBAKARAN" ? "bg-red-600 text-white" : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            <Flame className="w-3 h-3" /> Kebakaran
          </button>
          <button
            type="button"
            onClick={() => setFilterJenis("GEMPA")}
            className={`px-3 py-1 rounded-lg font-bold font-['Poppins',sans-serif] flex items-center gap-1 transition-colors ${
              filterJenis === "GEMPA" ? "bg-orange-600 text-white" : "bg-orange-50 text-orange-700 hover:bg-orange-100"
            }`}
          >
            <AlertTriangle className="w-3 h-3" /> Gempa Bumi
          </button>
        </div>
      </div>

      {loadingAwal && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-[#0140c7] rounded-full animate-spin" />
          <p className="text-xs text-gray-500 font-['Poppins',sans-serif]">Memuat daftar laporan...</p>
        </div>
      )}

      {!loadingAwal && errorAwal && filteredList.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center gap-2">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-sm text-gray-600 font-['Poppins',sans-serif]">{errorAwal}</p>
        </div>
      )}

      {!loadingAwal && filteredList.length === 0 && !errorAwal && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 font-['Poppins',sans-serif]">
            {activeTab === "MENUNGGU"
              ? "Tidak ada laporan yang menunggu validasi saat ini."
              : activeTab === "BERJALAN"
              ? "Tidak ada kejadian darurat yang sedang aktif berjalan."
              : "Tidak ada riwayat kejadian."}
          </p>
        </div>
      )}

      {/* List Laporan */}
      {filteredList.map(k => {
        const aksi = aksiMap[k.kejadianId] || {};
        const showTimeline = expandedTimeline[k.kejadianId] || activeTab === "BERJALAN";
        const isGempa = (k.jenisKejadian || "").toLowerCase().includes("gempa");

        return (
          <div key={k.kejadianId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold font-['Poppins',sans-serif] tracking-wide ${
                    k.status === "Menunggu Validasi"
                      ? "bg-yellow-100 text-yellow-700"
                      : ["Aman", "Selesai"].includes(k.status)
                      ? "bg-green-100 text-green-700"
                      : k.status === "Bukan Darurat"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {KEJADIAN_STATUS_LABEL[k.status] || k.status}
                </span>
                <h3 className="font-['Poppins',sans-serif] font-bold text-gray-800 text-base mt-1">
                  {k.jenisKejadian}
                </h3>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">{k.kodeKejadian}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                <Clock className="w-3.5 h-3.5" />
                <span>{fmtWaktu(k.waktuLapor)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>{k.lokasi}</span>
              </div>
              {k.deskripsi && (
                <p className="text-xs text-gray-500 bg-gray-50 rounded-xl p-3 leading-relaxed">{k.deskripsi}</p>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <User className="w-4 h-4 text-gray-400 shrink-0" />
                <span>
                  Dilaporkan oleh <span className="font-semibold text-gray-700">{k.dilaporkanOlehNama || "-"}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons for Menunggu Validasi */}
            {k.status === "Menunggu Validasi" && (
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <textarea
                  placeholder="Catatan validasi tim (opsional)"
                  value={catatanMap[k.kejadianId] || ""}
                  onChange={e => setCatatanMap(prev => ({ ...prev, [k.kejadianId]: e.target.value }))}
                  disabled={aksi.loading}
                  className="border border-gray-200 rounded-xl p-3 text-sm bg-white outline-none w-full shadow-sm min-h-[60px] font-['Poppins',sans-serif] disabled:opacity-60"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={aksi.loading}
                    onClick={() => openValidasiModal(k, true)}
                    className="flex-1 bg-green-600 text-white rounded-xl h-11 flex items-center justify-center gap-2 font-bold text-sm shadow-sm disabled:opacity-70 font-['Poppins',sans-serif]"
                  >
                    {aksi.loading ? (
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Kejadian Nyata
                  </button>
                  <button
                    type="button"
                    disabled={aksi.loading}
                    onClick={() => openValidasiModal(k, false)}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 rounded-xl h-11 flex items-center justify-center gap-2 font-bold text-sm disabled:opacity-70 font-['Poppins',sans-serif]"
                  >
                    {aksi.loading ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-500" />
                    )}
                    Bukan Darurat
                  </button>
                </div>

                {aksi.error && (
                  <p className="text-xs text-red-600 font-medium font-['Poppins',sans-serif]">{aksi.error}</p>
                )}
              </div>
            )}

            {/* Toggle Timeline Roadmap Section */}
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => toggleTimeline(k.kejadianId)}
                className="flex items-center justify-between text-xs font-bold text-[#0140c7] font-['Poppins',sans-serif] hover:underline"
              >
                <span>{showTimeline ? "Sembunyikan Timeline Penanganan" : "Tampilkan Timeline Penanganan Roadmap →"}</span>
                {showTimeline ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showTimeline && (
                <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-3 mt-1">
                  <h4 className="text-xs font-bold text-gray-700 font-['Poppins',sans-serif]">Roadmap Progres Aktivitas</h4>
                  <div className="flex flex-col gap-3 relative pl-2">
                    <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-gray-200" />
                    {STEPS.map((step, idx) => {
                      const curIdx = STEPS.findIndex(s => s.key === k.status);
                      const isDone = idx === 0 || (isGempa && idx === 1) || (curIdx !== -1 && idx <= curIdx);
                      const isActive = curIdx === idx || (isGempa && idx === 2 && curIdx <= 1);
                      return (
                        <div key={step.key} className={`flex items-start gap-3 relative z-10 ${!isDone && !isActive ? "opacity-40" : ""}`}>
                          <div
                            className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shrink-0 text-[10px] font-bold ${
                              isDone
                                ? "bg-green-600 text-white"
                                : isActive
                                ? "bg-yellow-500 text-white animate-pulse"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {isDone ? "✓" : idx + 1}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800 font-['Poppins',sans-serif]">{step.label}</p>
                            <p className="text-[10px] text-gray-500">
                              {step.getWaktu(k) ? fmtWaktu(step.getWaktu(k)) : isActive ? "Sedang berjalan..." : "Menunggu"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* MODAL KONFIRMASI & PILIH SKALA */}
      {modalConfig && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  modalConfig.hasilValidasi ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                }`}
              >
                {modalConfig.hasilValidasi ? <Shield className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-['Poppins',sans-serif] font-bold text-base text-gray-900">
                  {modalConfig.hasilValidasi ? "Konfirmasi Kejadian Nyata" : "Tandai Bukan Darurat"}
                </h3>
                <p className="text-xs text-gray-500">{modalConfig.kejadian.kodeKejadian}</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed font-['Poppins',sans-serif]">
              {modalConfig.hasilValidasi
                ? "Apakah Anda yakin laporan ini adalah Kejadian Nyata yang memerlukan tindakan tanggap darurat?"
                : "Apakah Anda yakin laporan ini BUKAN kejadian darurat (False Alarm)?"}
            </p>

            {/* Pilihan Skala Kebakaran jika Kejadian Nyata */}
            {modalConfig.hasilValidasi && (
              <div className="flex flex-col gap-2 bg-amber-50 border border-amber-200 p-3 rounded-2xl">
                <label className="text-xs font-bold text-amber-900 font-['Poppins',sans-serif]">
                  Tentukan Skala Kejadian:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Kecil", "Sedang", "Besar"].map(skala => (
                    <button
                      key={skala}
                      type="button"
                      onClick={() => setModalConfig(prev => ({ ...prev, skala }))}
                      className={`py-2 text-xs font-bold rounded-xl font-['Poppins',sans-serif] border transition-all ${
                        modalConfig.skala === skala
                          ? "bg-amber-600 text-white border-amber-600 shadow-sm scale-105"
                          : "bg-white text-gray-700 border-amber-200 hover:bg-amber-100"
                      }`}
                    >
                      {skala}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-amber-800 italic mt-0.5">
                  {modalConfig.skala === "Kecil" && "Skala Kecil: Penanganan lokal oleh tim area."}
                  {modalConfig.skala === "Sedang" && "Skala Sedang: Siaga tim damkar gedung."}
                  {modalConfig.skala === "Besar" && "Skala Besar: Pemicu sirine & Evakuasi Total Gedung!"}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalConfig(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 text-xs rounded-xl font-['Poppins',sans-serif]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleValidasiSubmit}
                className={`flex-1 text-white font-bold py-3 text-xs rounded-xl font-['Poppins',sans-serif] shadow-md ${
                  modalConfig.hasilValidasi ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {modalConfig.hasilValidasi ? "Ya, Validasi & Kirim" : "Ya, Tandai Palsu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PetugasLayout>
  );
}

