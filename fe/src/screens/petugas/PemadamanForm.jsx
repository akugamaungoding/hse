import { useEffect, useRef, useState } from "react";
import { PetugasLayout } from "../../components/PetugasLayout";
import { Flame, Truck, CheckCircle2, AlertTriangle, ShieldCheck, MessageSquare, Droplets } from "lucide-react";
import { useActiveKejadian } from "@/hooks/useActiveKejadian";
import { pemadamanServices } from "@/services/pemadamanServices";

function fmtJam(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
}

export function PemadamanForm() {
  const { kejadian } = useActiveKejadian();
  const kejadianId = kejadian?.kejadianId;

  const [loadingAwal, setLoadingAwal] = useState(true);

  // Fire scale state: Skala Kecil vs Skala Besar
  const [skalaKebakaran, setSkalaKebakaran] = useState("SKALA_KECIL");

  const [sumberApi, setSumberApi] = useState("");
  const [perluDamkar, setPerluDamkar] = useState(false);
  const [hasilPemadaman, setHasilPemadaman] = useState("");
  const [waktuPanggilDamkar, setWaktuPanggilDamkar] = useState(null);

  // Hydrant coordination with TKTD Coordinator (Unit K3)
  const [koordinasiHydrant, setKoordinasiHydrant] = useState("");
  const [koordinasiSubmitted, setKoordinasiSubmitted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const submittingRef = useRef(false);

  useEffect(() => {
    submittingRef.current = submitting;
  }, [submitting]);

  useEffect(() => {
    if (!kejadianId) {
      setLoadingAwal(false);
      setSumberApi("");
      setPerluDamkar(false);
      setHasilPemadaman("");
      setWaktuPanggilDamkar(null);
      return;
    }

    let mounted = true;

    const load = () => {
      if (submittingRef.current) return;
      pemadamanServices
        .get(kejadianId)
        .then((data) => {
          if (!mounted) return;
          setSumberApi(data?.sumberApi || "");
          setPerluDamkar(!!data?.perluDamkar);
          setHasilPemadaman(data?.hasilPemadaman || "");
          setWaktuPanggilDamkar(data?.waktuPanggilDamkar || null);
        })
        .catch((err) => {
          if (!mounted) return;
          if (err.response?.status === 404) {
            setSumberApi("");
            setPerluDamkar(false);
            setHasilPemadaman("");
            setWaktuPanggilDamkar(null);
          }
        })
        .finally(() => {
          if (mounted) setLoadingAwal(false);
        });
    };

    setLoadingAwal(true);
    load();
    const t = setInterval(load, 8000);

    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, [kejadianId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kejadianId) return;

    setSubmitting(true);
    setError("");
    setSuccess(false);
    try {
      await pemadamanServices.upsert(kejadianId, {
        sumberApi: `[${skalaKebakaran}] ${sumberApi || ""}`,
        perluDamkar,
        hasilPemadaman: hasilPemadaman || null,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Laporan pemadaman gagal disimpan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKirimKoordinasi = (e) => {
    e.preventDefault();
    if (!koordinasiHydrant.trim()) return;
    setKoordinasiSubmitted(true);
    setTimeout(() => {
      setKoordinasiSubmitted(false);
      setKoordinasiHydrant("");
    }, 3000);
  };

  return (
    <PetugasLayout title="Pemadaman Fire Fighter" subtitle="Tim Fire Fighter & Koordinasi Hydrant (K3)">
      {!kejadian && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Flame className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 font-['Poppins',sans-serif]">
            Tidak ada kejadian tanggap darurat yang sedang aktif saat ini.
          </p>
        </div>
      )}

      {kejadian && (
        <>
          {/* Header Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-[#e31212]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-gray-400 font-mono">{kejadian.kodeKejadian}</p>
              <h3 className="font-['Poppins',sans-serif] font-bold text-gray-800 text-base leading-tight">
                {kejadian.jenisKejadian}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{kejadian.lokasi}</p>
            </div>
          </div>

          {loadingAwal && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-[#e31212] rounded-full animate-spin" />
              <p className="text-xs text-gray-500 font-['Poppins',sans-serif]">Memuat data pemadaman...</p>
            </div>
          )}

          {!loadingAwal && (
            <div className="flex flex-col gap-4">
              {/* Form Pemadaman */}
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-4"
              >
                {/* Skala Kebakaran Selection */}
                <div className="flex flex-col gap-2">
                  <label className="font-['Poppins',sans-serif] font-bold text-sm text-gray-800">
                    Tipe & Skala Kebakaran
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSkalaKebakaran("SKALA_KECIL")}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        skalaKebakaran === "SKALA_KECIL"
                          ? "bg-amber-50 border-amber-400 ring-2 ring-amber-300"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <span className="text-xs font-bold text-amber-800">Skala Kecil</span>
                      <span className="text-[10px] text-gray-600">
                        Tidak perlu evakuasi satu lantai (Pemadaman langsung APAR / Nozzle)
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSkalaKebakaran("SKALA_BESAR")}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        skalaKebakaran === "SKALA_BESAR"
                          ? "bg-red-50 border-red-400 ring-2 ring-red-300"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <span className="text-xs font-bold text-red-800">Skala Besar</span>
                      <span className="text-[10px] text-gray-600">
                        Dilakukan evakuasi gedung & aktivasi Hydrant Utama
                      </span>
                    </button>
                  </div>
                </div>

                {/* Sumber Api */}
                <div className="flex flex-col gap-2">
                  <label className="font-['Poppins',sans-serif] font-bold text-sm text-gray-800">
                    Sumber Api / Bahaya
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Korsleting panel listrik lantai 2"
                    value={sumberApi}
                    onChange={(e) => setSumberApi(e.target.value)}
                    className="border border-gray-200 rounded-xl p-3 text-sm bg-white outline-none w-full shadow-sm font-['Poppins',sans-serif]"
                  />
                </div>

                {/* Call DAMKAR Checkbox */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl p-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={perluDamkar}
                      onChange={(e) => setPerluDamkar(e.target.checked)}
                      className="w-5 h-5 accent-[#e31212] shrink-0"
                    />
                    <span className="flex items-center gap-2 text-sm font-['Poppins',sans-serif] font-bold text-gray-800">
                      <Truck className="w-4 h-4 text-[#e31212] shrink-0" />
                      Perlu DAMKAR (Pemadam Eksternal)?
                    </span>
                  </label>

                  {waktuPanggilDamkar && (
                    <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                      <AlertTriangle className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
                      <p className="text-xs text-yellow-800 font-['Poppins',sans-serif]">
                        DAMKAR telah dipanggil pada {fmtJam(waktuPanggilDamkar)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Hasil Pemadaman */}
                <div className="flex flex-col gap-2">
                  <label className="font-['Poppins',sans-serif] font-bold text-sm text-gray-800">
                    Hasil Pemadaman Fire Fighter
                  </label>
                  <textarea
                    placeholder="Jelaskan hasil penanganan sumber api..."
                    value={hasilPemadaman}
                    onChange={(e) => setHasilPemadaman(e.target.value)}
                    className="border border-gray-200 rounded-xl p-3 text-sm bg-white outline-none w-full shadow-sm min-h-[80px] font-['Poppins',sans-serif]"
                  />
                </div>

                {error && <p className="text-xs text-red-600 font-medium font-['Poppins',sans-serif]">{error}</p>}
                {success && (
                  <p className="flex items-center gap-1.5 text-xs text-green-700 font-medium font-['Poppins',sans-serif]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    Laporan pemadaman tersimpan.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#e31212] text-white rounded-xl h-12 flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-red-200 disabled:opacity-70 transition-all font-['Poppins',sans-serif]"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Laporan Pemadaman"
                  )}
                </button>
              </form>

              {/* Fire Fighter Hydrant Coordination with Koordinator TKTD (Unit K3) */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Droplets className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-['Poppins',sans-serif] font-bold text-sm text-gray-800">
                      Koordinasi Hydrant dengan Koordinator TKTD (Unit K3)
                    </h4>
                    <p className="text-[10px] text-gray-400">
                      Fire Fighter Hydrant ↔ Koordinator TKTD (K3) Channel
                    </p>
                  </div>
                </div>

                <form onSubmit={handleKirimKoordinasi} className="flex flex-col gap-2">
                  <textarea
                    value={koordinasiHydrant}
                    onChange={(e) => setKoordinasiHydrant(e.target.value)}
                    placeholder="Tulis instruksi/update tekanan hydrant ke Koordinator TKTD..."
                    className="w-full border border-gray-200 rounded-xl p-3 text-xs bg-gray-50 outline-none font-['Poppins',sans-serif] min-h-[70px]"
                  />
                  <button
                    type="submit"
                    className="bg-[#0140c7] text-white rounded-xl h-10 font-bold text-xs shadow-sm hover:bg-blue-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Kirim Pesan Koordinasi Hydrant (K3)
                  </button>
                  {koordinasiSubmitted && (
                    <p className="text-xs text-green-600 font-bold text-center">
                      Pesan koordinasi hydrant berhasil terkirim ke Koordinator TKTD!
                    </p>
                  )}
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </PetugasLayout>
  );
}
