import { useEffect, useState } from "react";
import { PetugasLayout } from "../../components/PetugasLayout";
import { Building2, Users, CheckCircle2, ArrowRight, Clock } from "lucide-react";
import { useActiveKejadian } from "@/hooks/useActiveKejadian";
import { evakuasiServices } from "@/services/evakuasiServices";

function fmtJam(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
}

const STATUS_META = {
  "Belum": { label: "Menunggu Instruksi", bg: "bg-gray-100", text: "text-gray-600" },
  "Sedang Evakuasi": { label: "Sedang Evakuasi", bg: "bg-yellow-100", text: "text-yellow-700" },
  "Kosong": { label: "Lantai Kosong", bg: "bg-green-100", text: "text-green-700" },
};

function StatusPill({ status }) {
  const meta = STATUS_META[status] || STATUS_META["Belum"];
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full ${meta.bg} ${meta.text} text-[10px] font-bold font-['Poppins',sans-serif] tracking-wide shrink-0`}
    >
      {meta.label}
    </span>
  );
}

export function EvakuasiLantai() {
  const { kejadian } = useActiveKejadian();
  const [daftar, setDaftar] = useState([]);
  const [loadingAwal, setLoadingAwal] = useState(true);
  const [errorAwal, setErrorAwal] = useState("");
  const [catatanMap, setCatatanMap] = useState({});
  const [aksiMap, setAksiMap] = useState({});

  const kejadianId = kejadian?.kejadianId;

  useEffect(() => {
    if (!kejadianId) {
      setDaftar([]);
      setLoadingAwal(false);
      return;
    }

    let mounted = true;
    const load = () => {
      evakuasiServices
        .getByKejadian(kejadianId)
        .then((data) => {
          if (!mounted) return;
          setDaftar(Array.isArray(data) ? data : []);
          setErrorAwal("");
        })
        .catch(() => {
          if (mounted) setErrorAwal("Gagal memuat data evakuasi lantai. Mencoba lagi...");
        })
        .finally(() => {
          if (mounted) setLoadingAwal(false);
        });
    };

    setLoadingAwal(true);
    load();
    const t = setInterval(load, 6000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, [kejadianId]);

  const refetch = async () => {
    if (!kejadianId) return;
    try {
      const data = await evakuasiServices.getByKejadian(kejadianId);
      setDaftar(Array.isArray(data) ? data : []);
    } catch {
    }
  };

  const handleInstruksi = async (evakuasiId) => {
    setAksiMap((prev) => ({ ...prev, [evakuasiId]: { loading: true, error: "" } }));
    try {
      await evakuasiServices.instruksi(evakuasiId);
      await refetch();
      setAksiMap((prev) => {
        const next = { ...prev };
        delete next[evakuasiId];
        return next;
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal memulai evakuasi. Silakan coba lagi.";
      setAksiMap((prev) => ({ ...prev, [evakuasiId]: { loading: false, error: msg } }));
    }
  };

  const handleSelesai = async (evakuasiId) => {
    setAksiMap((prev) => ({ ...prev, [evakuasiId]: { loading: true, error: "" } }));
    try {
      await evakuasiServices.selesai(evakuasiId, catatanMap[evakuasiId] || undefined);
      await refetch();
      setAksiMap((prev) => {
        const next = { ...prev };
        delete next[evakuasiId];
        return next;
      });
      setCatatanMap((prev) => {
        const next = { ...prev };
        delete next[evakuasiId];
        return next;
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menandai lantai kosong. Silakan coba lagi.";
      setAksiMap((prev) => ({ ...prev, [evakuasiId]: { loading: false, error: msg } }));
    }
  };

  const daftarUrut = [...daftar].sort((a, b) => {
    const g = (a.gedung || "").localeCompare(b.gedung || "");
    if (g !== 0) return g;
    return (a.namaLantai || "").localeCompare(b.namaLantai || "");
  });

  const totalLantai = daftarUrut.length;
  const totalKosong = daftarUrut.filter((l) => l.status === "Kosong").length;

  return (
    <PetugasLayout title="Evakuasi Lantai" subtitle="PIC Lantai (Floor Warden)">
      {!kejadian && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 font-['Poppins',sans-serif]">
            Tidak ada kejadian tanggap darurat yang sedang aktif saat ini.
          </p>
        </div>
      )}

      {kejadian && (
        <>
          { }          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-[#e31212]" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400 font-mono">{kejadian.kodeKejadian}</p>
              <h3 className="font-['Poppins',sans-serif] font-bold text-gray-800 text-base leading-tight">
                {kejadian.jenisKejadian}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{kejadian.lokasi}</p>
            </div>
          </div>

          {loadingAwal && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-[#0140c7] rounded-full animate-spin" />
              <p className="text-xs text-gray-500 font-['Poppins',sans-serif]">Memuat data evakuasi lantai...</p>
            </div>
          )}

          {!loadingAwal && errorAwal && daftarUrut.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center gap-2">
              <p className="text-sm text-gray-600 font-['Poppins',sans-serif]">{errorAwal}</p>
            </div>
          )}

          {!loadingAwal && !errorAwal && daftarUrut.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center gap-2">
              <p className="text-sm text-gray-600 font-['Poppins',sans-serif]">
                Belum ada data lantai untuk kejadian ini.
              </p>
            </div>
          )}

          {totalLantai > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-[#0140c7]" />
              </div>
              <p className="text-sm text-gray-700 font-['Poppins',sans-serif]">
                <span className="font-bold text-gray-900">{totalKosong}</span> dari{" "}
                <span className="font-bold text-gray-900">{totalLantai}</span> lantai sudah kosong
              </p>
            </div>
          )}

          {daftarUrut.map((l) => {
            const aksi = aksiMap[l.evakuasiId] || {};
            return (
              <div
                key={l.evakuasiId}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-['Poppins',sans-serif] font-bold text-gray-800 text-sm leading-tight">
                      {l.gedung} - {l.namaLantai}
                    </p>
                  </div>
                  <StatusPill status={l.status} />
                </div>

                {l.status === "Belum" && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      disabled={aksi.loading}
                      onClick={() => handleInstruksi(l.evakuasiId)}
                      className="w-full bg-[#0140c7] text-white rounded-xl h-11 flex items-center justify-center gap-2 font-bold text-sm shadow-sm disabled:opacity-70 font-['Poppins',sans-serif]"
                    >
                      {aksi.loading ? (
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                      Mulai Evakuasi
                    </button>
                    {aksi.error && (
                      <p className="text-xs text-red-600 font-medium font-['Poppins',sans-serif]">{aksi.error}</p>
                    )}
                  </div>
                )}

                {l.status === "Sedang Evakuasi" && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                    <input
                      type="text"
                      placeholder="Catatan (opsional)"
                      value={catatanMap[l.evakuasiId] || ""}
                      onChange={(e) =>
                        setCatatanMap((prev) => ({ ...prev, [l.evakuasiId]: e.target.value }))
                      }
                      disabled={aksi.loading}
                      className="border border-gray-200 rounded-xl h-11 px-3 text-sm bg-white outline-none w-full shadow-sm font-['Poppins',sans-serif] disabled:opacity-60"
                    />
                    <button
                      type="button"
                      disabled={aksi.loading}
                      onClick={() => handleSelesai(l.evakuasiId)}
                      className="w-full bg-green-600 text-white rounded-xl h-11 flex items-center justify-center gap-2 font-bold text-sm shadow-sm disabled:opacity-70 font-['Poppins',sans-serif]"
                    >
                      {aksi.loading ? (
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      Tandai Kosong / Selesai
                    </button>
                    {aksi.error && (
                      <p className="text-xs text-red-600 font-medium font-['Poppins',sans-serif]">{aksi.error}</p>
                    )}
                  </div>
                )}

                {l.status === "Kosong" && (
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>Dilaporkan kosong pukul {fmtJam(l.waktuLaporan)}</span>
                    </div>
                    {l.catatan && (
                      <p className="text-xs text-gray-500 bg-gray-50 rounded-xl p-3 leading-relaxed">{l.catatan}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </PetugasLayout>
  );
}
