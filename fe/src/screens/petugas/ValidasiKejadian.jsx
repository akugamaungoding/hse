import { useEffect, useState } from "react";
import { PetugasLayout } from "../../components/PetugasLayout";
import { AlertCircle, CheckCircle2, XCircle, Clock, MapPin, User } from "lucide-react";
import { kejadianServices } from "@/services/kejadianServices";

export function fmtWaktu(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  const jam = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
  const tanggal = d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  return `${tanggal}, ${jam}`;
}

export function ValidasiKejadian() {
  const [daftar, setDaftar] = useState([]);
  const [loadingAwal, setLoadingAwal] = useState(true);
  const [errorAwal, setErrorAwal] = useState("");
  const [catatanMap, setCatatanMap] = useState({});
  const [aksiMap, setAksiMap] = useState({});

  useEffect(() => {
    let mounted = true;
    const load = () => {
      kejadianServices.getAll({ status: "Menunggu Validasi", pageSize: 50 })
        .then(res => {
          if (!mounted) return;
          setDaftar(res?.data || []);
          setErrorAwal("");
        })
        .catch(() => {
          if (mounted) setErrorAwal("Gagal memuat daftar laporan. Mencoba lagi...");
        })
        .finally(() => {
          if (mounted) setLoadingAwal(false);
        });
    };
    load();
    const t = setInterval(load, 8000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, []);

  const handleValidasi = async (kejadianId, hasilValidasi) => {
    setAksiMap(prev => ({ ...prev, [kejadianId]: { loading: true, error: "" } }));
    try {
      await kejadianServices.validasi(kejadianId, {
        hasilValidasi,
        catatan: catatanMap[kejadianId] || undefined,
      });
      setDaftar(prev => prev.filter(k => k.kejadianId !== kejadianId));
      setAksiMap(prev => {
        const next = { ...prev };
        delete next[kejadianId];
        return next;
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Validasi gagal dikirim. Silakan coba lagi.";
      setAksiMap(prev => ({ ...prev, [kejadianId]: { loading: false, error: msg } }));
    }
  };

  return (
    <PetugasLayout title="Validasi Kejadian" subtitle="Tim Identifikasi Kejadian Darurat">
      {loadingAwal && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-[#0140c7] rounded-full animate-spin" />
          <p className="text-xs text-gray-500 font-['Poppins',sans-serif]">Memuat laporan yang menunggu validasi...</p>
        </div>
      )}

      {!loadingAwal && errorAwal && daftar.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center gap-2">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-sm text-gray-600 font-['Poppins',sans-serif]">{errorAwal}</p>
        </div>
      )}

      {!loadingAwal && daftar.length === 0 && !errorAwal && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 font-['Poppins',sans-serif]">
            Tidak ada laporan yang menunggu validasi saat ini.
          </p>
        </div>
      )}

      {daftar.map(k => {
        const aksi = aksiMap[k.kejadianId] || {};
        return (
          <div key={k.kejadianId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-bold font-['Poppins',sans-serif] tracking-wide">
                  MENUNGGU VALIDASI
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
                <span>Dilaporkan oleh <span className="font-semibold text-gray-700">{k.dilaporkanOlehNama || "-"}</span></span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <textarea
                placeholder="Catatan validasi (opsional)"
                value={catatanMap[k.kejadianId] || ""}
                onChange={e => setCatatanMap(prev => ({ ...prev, [k.kejadianId]: e.target.value }))}
                disabled={aksi.loading}
                className="border border-gray-200 rounded-xl p-3 text-sm bg-white outline-none w-full shadow-sm min-h-[60px] font-['Poppins',sans-serif] disabled:opacity-60"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={aksi.loading}
                  onClick={() => handleValidasi(k.kejadianId, true)}
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
                  onClick={() => handleValidasi(k.kejadianId, false)}
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
          </div>
        );
      })}
    </PetugasLayout>
  );
}
