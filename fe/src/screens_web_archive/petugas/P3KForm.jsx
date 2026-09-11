import { useEffect, useRef, useState } from "react";
import { PetugasLayout } from "../../components/PetugasLayout";
import { HeartPulse, AlertTriangle, Ambulance, CheckCircle2 } from "lucide-react";
import { useActiveKejadian } from "@/hooks/useActiveKejadian";
import { p3kServices } from "@/services/p3kServices";

function fmtJam(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
}

const DEFAULT_FORM = {
  adaKorban: false,
  jumlahKorban: "",
  kondisiKorban: "",
  tindakan: "",
  perluAmbulans: false,
};

export function P3KForm() {
  const { kejadian } = useActiveKejadian();
  const kejadianId = kejadian?.kejadianId;

  const [form, setForm] = useState(DEFAULT_FORM);
  const [waktuPanggilAmbulans, setWaktuPanggilAmbulans] = useState(null);
  const [loadingAwal, setLoadingAwal] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submittingRef = useRef(false);
  useEffect(() => {
    submittingRef.current = submitting;
  }, [submitting]);

  useEffect(() => {
    if (!kejadianId) {
      setForm(DEFAULT_FORM);
      setWaktuPanggilAmbulans(null);
      setLoadingAwal(false);
      return;
    }

    let mounted = true;
    const load = () => {
      if (submittingRef.current) return;
      p3kServices
        .get(kejadianId)
        .then((data) => {
          if (!mounted || submittingRef.current) return;
          setForm({
            adaKorban: !!data.adaKorban,
            jumlahKorban: data.jumlahKorban === null || data.jumlahKorban === undefined ? "" : String(data.jumlahKorban),
            kondisiKorban: data.kondisiKorban || "",
            tindakan: data.tindakan || "",
            perluAmbulans: !!data.perluAmbulans,
          });
          setWaktuPanggilAmbulans(data.waktuPanggilAmbulans || null);
        })
        .catch((err) => {
          if (!mounted || submittingRef.current) return;
          if (err.response?.status === 404) {
            setForm(DEFAULT_FORM);
            setWaktuPanggilAmbulans(null);
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

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kejadianId) return;

    setSubmitting(true);
    setError("");
    setSuccess(false);
    try {
      await p3kServices.upsert(kejadianId, {
        adaKorban: form.adaKorban,
        jumlahKorban: form.jumlahKorban === "" ? null : Number(form.jumlahKorban),
        kondisiKorban: form.kondisiKorban || null,
        tindakan: form.tindakan || null,
        perluAmbulans: form.perluAmbulans,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Laporan P3K gagal disimpan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PetugasLayout title="Pertolongan Pertama" subtitle="Tim P3K">
      {!kejadian && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <HeartPulse className="w-8 h-8 text-gray-400" />
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
              <HeartPulse className="w-5 h-5 text-[#e31212]" />
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
              <p className="text-xs text-gray-500 font-['Poppins',sans-serif]">Memuat data P3K...</p>
            </div>
          )}

          {!loadingAwal && (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-4">
              { }              <div className="flex flex-col gap-2">
                <label className="font-['Poppins',sans-serif] font-bold text-sm text-gray-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-gray-400" />
                  Ada Korban?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateField("adaKorban", true)}
                    className={`h-11 rounded-xl text-sm font-bold font-['Poppins',sans-serif] transition-colors border ${form.adaKorban
                      ? "bg-red-100 text-red-700 border-red-200"
                      : "bg-white text-gray-500 border-gray-200"
                      }`}
                  >
                    Ya
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField("adaKorban", false)}
                    className={`h-11 rounded-xl text-sm font-bold font-['Poppins',sans-serif] transition-colors border ${!form.adaKorban
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-white text-gray-500 border-gray-200"
                      }`}
                  >
                    Tidak
                  </button>
                </div>
              </div>

              {form.adaKorban && (
                <>
                  { }                  <div className="flex flex-col gap-2">
                    <label className="font-['Poppins',sans-serif] font-bold text-sm text-gray-800">
                      Jumlah Korban
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Contoh: 2"
                      value={form.jumlahKorban}
                      onChange={(e) => updateField("jumlahKorban", e.target.value)}
                      className="border border-gray-200 rounded-xl p-3 text-sm bg-white outline-none w-full shadow-sm font-['Poppins',sans-serif]"
                    />
                  </div>

                  { }                  <div className="flex flex-col gap-2">
                    <label className="font-['Poppins',sans-serif] font-bold text-sm text-gray-800">
                      Kondisi Korban
                    </label>
                    <textarea
                      placeholder="Jelaskan kondisi korban..."
                      value={form.kondisiKorban}
                      onChange={(e) => updateField("kondisiKorban", e.target.value)}
                      className="border border-gray-200 rounded-xl p-3 text-sm bg-white outline-none w-full shadow-sm min-h-[80px] font-['Poppins',sans-serif]"
                    />
                  </div>

                  { }                  <div className="flex flex-col gap-2">
                    <label className="font-['Poppins',sans-serif] font-bold text-sm text-gray-800">
                      Tindakan yang Dilakukan
                    </label>
                    <textarea
                      placeholder="Jelaskan pertolongan pertama yang sudah dilakukan..."
                      value={form.tindakan}
                      onChange={(e) => updateField("tindakan", e.target.value)}
                      className="border border-gray-200 rounded-xl p-3 text-sm bg-white outline-none w-full shadow-sm min-h-[80px] font-['Poppins',sans-serif]"
                    />
                  </div>
                </>
              )}

              { }              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <label className="font-['Poppins',sans-serif] font-bold text-sm text-gray-800 flex items-center gap-2">
                  <Ambulance className="w-4 h-4 text-gray-400" />
                  Perlu Ambulans?
                </label>
                <button
                  type="button"
                  onClick={() => updateField("perluAmbulans", !form.perluAmbulans)}
                  className={`w-full h-11 rounded-xl text-sm font-bold font-['Poppins',sans-serif] transition-colors border flex items-center justify-center gap-2 ${form.perluAmbulans
                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                    : "bg-white text-gray-500 border-gray-200"
                    }`}
                >
                  {form.perluAmbulans && <CheckCircle2 className="w-4 h-4" />}
                  {form.perluAmbulans ? "Ya, Ambulans Dibutuhkan" : "Tidak Perlu Ambulans"}
                </button>
                {waktuPanggilAmbulans && (
                  <p className="text-[11px] text-gray-500 font-['Poppins',sans-serif]">
                    Ambulans telah dipanggil pada {fmtJam(waktuPanggilAmbulans)}
                  </p>
                )}
              </div>

              {error && <p className="text-xs text-red-600 font-medium font-['Poppins',sans-serif]">{error}</p>}
              {success && !error && (
                <p className="text-xs text-green-600 font-bold font-['Poppins',sans-serif]">Laporan tersimpan.</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0140c7] text-white rounded-xl h-12 flex items-center justify-center gap-2 font-bold text-sm shadow-sm disabled:opacity-70 font-['Poppins',sans-serif]"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Laporan P3K"
                )}
              </button>
            </form>
          )}
        </>
      )}
    </PetugasLayout>
  );
}
