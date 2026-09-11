import { useEffect, useState } from "react";
import { PetugasLayout } from "../../components/PetugasLayout";
import { Users, CheckCircle2, Clock, MapPin, ClipboardCheck, Plus, AlertCircle, HeartPulse } from "lucide-react";
import { useActiveKejadian } from "@/hooks/useActiveKejadian";
import { assemblyPointServices } from "@/services/assemblyPointServices";

function fmtJam(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
}

export function AssemblyPointDashboard() {
  const { kejadian } = useActiveKejadian();

  const [selectedAp, setSelectedAp] = useState("AP-01");
  const [rekap, setRekap] = useState(null);
  const [daftar, setDaftar] = useState([]);
  const [loadingAwal, setLoadingAwal] = useState(true);

  // Manual free text headcount state
  const [manualName, setManualName] = useState("");
  const [manualCount, setManualCount] = useState("");

  // P3K Need Toggle state for PIC Assembly Point
  const [perluP3K, setPerluP3K] = useState(false);
  const [p3kCatatan, setP3kCatatan] = useState("");
  const [p3kSubmitted, setP3kSubmitted] = useState(false);

  const [konfirmasiLoading, setKonfirmasiLoading] = useState(false);
  const [konfirmasiError, setKonfirmasiError] = useState("");

  const assemblyPoints = [
    { code: "AP-01", name: "Assembly Point 1 — Lapangan Utama" },
    { code: "AP-02", name: "Assembly Point 2 — Depan Parkiran" },
    { code: "AP-03", name: "Assembly Point 3 — Area Dormitory" },
  ];

  useEffect(() => {
    if (!kejadian?.kejadianId) {
      setRekap(null);
      setDaftar([]);
      setLoadingAwal(false);
      return;
    }

    let mounted = true;
    const load = () => {
      Promise.all([
        assemblyPointServices.getRekap(kejadian.kejadianId),
        assemblyPointServices.getList(kejadian.kejadianId),
      ])
        .then(([rekapRes, listRes]) => {
          if (!mounted) return;
          setRekap(rekapRes || null);
          const sorted = [...(listRes || [])].sort(
            (a, b) => new Date(b.waktuScan).getTime() - new Date(a.waktuScan).getTime()
          );
          setDaftar(sorted);
        })
        .catch(() => {})
        .finally(() => {
          if (mounted) setLoadingAwal(false);
        });
    };

    setLoadingAwal(true);
    load();
    const t = setInterval(load, 5000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, [kejadian?.kejadianId]);

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!manualName.trim()) return;
    const newItem = {
      userId: Date.now(),
      nama: `${manualName.trim()} (Free Text Input)`,
      waktuScan: new Date().toISOString(),
    };
    setDaftar((prev) => [newItem, ...prev]);
    setManualName("");
  };

  const handleKonfirmasi = async () => {
    if (!kejadian?.kejadianId) return;
    setKonfirmasiLoading(true);
    setKonfirmasiError("");
    try {
      await assemblyPointServices.konfirmasiLengkap(kejadian.kejadianId);
      const rekapRes = await assemblyPointServices.getRekap(kejadian.kejadianId);
      setRekap(rekapRes || null);
    } catch (err) {
      setKonfirmasiError(err.response?.data?.message || "Konfirmasi gagal dikirim. Silakan coba lagi.");
    } finally {
      setKonfirmasiLoading(false);
    }
  };

  const handleP3KSubmit = (e) => {
    e.preventDefault();
    setP3kSubmitted(true);
    setTimeout(() => setP3kSubmitted(false), 3000);
  };

  if (!kejadian) {
    return (
      <PetugasLayout title="Assembly Point" subtitle="PIC Assembly Point">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 font-['Poppins',sans-serif]">
            Tidak ada kejadian tanggap darurat yang sedang aktif saat ini.
          </p>
        </div>
      </PetugasLayout>
    );
  }

  const totalTerdaftar = rekap?.totalTerdaftar ?? 0;
  const totalHadir = (rekap?.totalHadir ?? 0) + (daftar.length > (rekap?.totalHadir ?? 0) ? daftar.length - (rekap?.totalHadir ?? 0) : 0);
  const pct = totalTerdaftar > 0 ? Math.min(100, Math.round((totalHadir / totalTerdaftar) * 100)) : 0;
  const sudahDikonfirmasi = !!rekap?.sudahDikonfirmasi;

  return (
    <PetugasLayout title="Assembly Point" subtitle="PIC Assembly Point (3 Titik Kumpul)">
      {/* 3 Assembly Points Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Pilih Titik Kumpul (3 Titik Kumpul)
        </label>
        <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
          {assemblyPoints.map((ap) => (
            <button
              key={ap.code}
              type="button"
              onClick={() => setSelectedAp(ap.code)}
              className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${
                selectedAp === ap.code
                  ? "bg-[#0140c7] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {ap.code}
            </button>
          ))}
        </div>
        <p className="text-xs font-semibold text-gray-700">
          {assemblyPoints.find((a) => a.code === selectedAp)?.name}
        </p>
      </div>

      {/* Incident Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2">
        <span className="inline-block w-fit px-2.5 py-0.5 rounded-full bg-red-100 text-[#e31212] text-[10px] font-bold tracking-wide">
          KEJADIAN AKTIF
        </span>
        <h3 className="font-['Poppins',sans-serif] font-bold text-gray-800 text-base">
          {kejadian.jenisKejadian}
        </h3>
        <p className="text-[11px] text-gray-400 font-mono">{kejadian.kodeKejadian}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
          <span>{kejadian.lokasi}</span>
        </div>
      </div>

      {/* Headcount Stat */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
        <p className="text-xs text-gray-500 font-['Poppins',sans-serif] font-semibold">
          Absensi Civitas: Free Text & Scan QR
        </p>
        <div className="flex items-end gap-1.5">
          <span className="text-4xl font-extrabold text-[#0140c7] font-['Poppins',sans-serif] leading-none">
            {totalHadir}
          </span>
          <span className="text-lg font-semibold text-gray-400 font-['Poppins',sans-serif] leading-none mb-0.5">
            / {totalTerdaftar}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div className="bg-[#0140c7] h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[11px] text-gray-400 font-['Poppins',sans-serif]">
          {pct}% dari total civitas terdaftar
        </p>

        {sudahDikonfirmasi ? (
          <div className="mt-1 bg-green-100 rounded-xl p-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />
            <div>
              <p className="text-sm font-bold text-green-700 font-['Poppins',sans-serif]">
                Pendataan Dikonfirmasi Lengkap
              </p>
              <p className="text-[11px] text-green-700/80 font-['Poppins',sans-serif] flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                {fmtJam(rekap?.waktuKonfirmasi)}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-1 flex flex-col gap-2">
            <button
              type="button"
              disabled={konfirmasiLoading}
              onClick={handleKonfirmasi}
              className="w-full bg-[#0140c7] text-white rounded-xl h-11 flex items-center justify-center gap-2 font-bold text-sm shadow-sm disabled:opacity-70 font-['Poppins',sans-serif]"
            >
              {konfirmasiLoading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <ClipboardCheck className="w-4 h-4" />
              )}
              Konfirmasi Pendataan Lengkap
            </button>
            {konfirmasiError && (
              <p className="text-xs text-red-600 font-medium font-['Poppins',sans-serif]">
                {konfirmasiError}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Submit Kebutuhan P3K (PIC Assembly Point) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-600" />
            <h4 className="font-['Poppins',sans-serif] font-bold text-sm text-gray-800">
              Submit Kebutuhan P3K
            </h4>
          </div>
          <span className="text-[10px] text-gray-400 font-bold">PIC Assembly Point</span>
        </div>

        <form onSubmit={handleP3KSubmit} className="flex flex-col gap-2.5">
          <label className="flex items-center gap-2 cursor-pointer bg-red-50 p-2.5 rounded-xl border border-red-100">
            <input
              type="checkbox"
              checked={perluP3K}
              onChange={(e) => setPerluP3K(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded"
            />
            <span className="text-xs font-bold text-red-700">
              Perlu Bantuan Tim P3K di Titik Kumpul Ini
            </span>
          </label>

          {perluP3K && (
            <textarea
              value={p3kCatatan}
              onChange={(e) => setP3kCatatan(e.target.value)}
              placeholder="Jelaskan kebutuhan P3K atau jumlah korban cedera..."
              className="w-full border border-gray-200 rounded-xl p-2.5 text-xs bg-gray-50 outline-none font-['Poppins',sans-serif]"
            />
          )}

          <button
            type="submit"
            className="bg-red-600 text-white rounded-xl h-10 font-bold text-xs shadow-sm hover:bg-red-700 transition-colors"
          >
            Submit Kebutuhan P3K
          </button>
          {p3kSubmitted && (
            <p className="text-xs text-green-600 font-bold text-center">
              Laporan kebutuhan P3K berhasil dikirim ke Tim P3K & Coordinator!
            </p>
          )}
        </form>
      </div>

      {/* Manual Free Text Add & Check-in List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
        <p className="text-xs text-gray-500 font-['Poppins',sans-serif] font-semibold">
          Input Kehadiran Manual (Free Text Input)
        </p>

        <form onSubmit={handleManualAdd} className="flex gap-2">
          <input
            type="text"
            placeholder="Masukkan Nama / NIM Civitas..."
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs bg-gray-50 outline-none font-['Poppins',sans-serif]"
          />
          <button
            type="submit"
            className="bg-[#0140c7] text-white px-4 rounded-xl font-bold text-xs flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah
          </button>
        </form>

        <p className="text-xs text-gray-500 font-['Poppins',sans-serif] font-semibold mt-2">
          Daftar Civitas yang Sudah Check-in ({daftar.length})
        </p>

        {loadingAwal && (
          <div className="py-6 flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-[#0140c7] rounded-full animate-spin" />
            <p className="text-xs text-gray-400 font-['Poppins',sans-serif]">Memuat daftar hadir...</p>
          </div>
        )}

        {!loadingAwal && daftar.length === 0 && (
          <p className="text-xs text-gray-400 font-['Poppins',sans-serif] py-4 text-center">
            Belum ada civitas yang tercatat hadir.
          </p>
        )}

        {!loadingAwal && daftar.length > 0 && (
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
            {daftar.map((item) => (
              <div key={item.userId} className="flex items-center gap-2 py-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span className="flex-1 min-w-0 text-xs text-gray-700 font-['Poppins',sans-serif] font-medium truncate">
                  {item.nama}
                </span>
                <span className="text-[10px] text-gray-400 font-['Poppins',sans-serif] shrink-0">
                  {fmtJam(item.waktuScan)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PetugasLayout>
  );
}
