import { useCallback, useEffect, useRef, useState } from "react";
import { PetugasLayout } from "../../components/PetugasLayout";
import { FileText, CheckCircle2, Clock, History, MapPin, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { kejadianServices } from "@/services/kejadianServices";
import { laporanServices } from "@/services/laporanServices";
import { KEJADIAN_STATUS_LABEL } from "@/constants/routes";

const POLL_MS = 8000;

function fmtTime(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
}

function fmtDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function LaporanKejadian() {
  const [perluLaporan, setPerluLaporan] = useState([]);
  const [loadingPerlu, setLoadingPerlu] = useState(true);
  const [perluError, setPerluError] = useState("");

  const [riwayat, setRiwayat] = useState([]);
  const [loadingRiwayat, setLoadingRiwayat] = useState(true);
  const [riwayatError, setRiwayatError] = useState("");

  const [formState, setFormState] = useState({});
  const [detailState, setDetailState] = useState({});

  const mountedRef = useRef(true);

  const loadPerluLaporan = useCallback(() => {
    return kejadianServices
      .getAll({ status: "Aman", pageSize: 20 })
      .then(res => {
        if (mountedRef.current) {
          setPerluLaporan(Array.isArray(res?.data) ? res.data : []);
          setPerluError("");
        }
      })
      .catch(() => {
        if (mountedRef.current) setPerluError("Gagal memuat daftar kejadian yang menunggu laporan.");
      })
      .finally(() => {
        if (mountedRef.current) setLoadingPerlu(false);
      });
  }, []);

  const loadRiwayat = useCallback(() => {
    return laporanServices
      .getAll(1, 20)
      .then(res => {
        if (mountedRef.current) {
          setRiwayat(Array.isArray(res?.data) ? res.data : []);
          setRiwayatError("");
        }
      })
      .catch(() => {
        if (mountedRef.current) setRiwayatError("Gagal memuat riwayat laporan.");
      })
      .finally(() => {
        if (mountedRef.current) setLoadingRiwayat(false);
      });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadPerluLaporan();
    loadRiwayat();
    const t = setInterval(loadPerluLaporan, POLL_MS);
    return () => {
      mountedRef.current = false;
      clearInterval(t);
    };
  }, [loadPerluLaporan, loadRiwayat]);

  const setCardForm = (id, patch) => {
    setFormState(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const handleSubmitLaporan = async id => {
    const form = formState[id] || {};
    const ringkasan = (form.ringkasan || "").trim();
    if (!ringkasan) {
      setCardForm(id, { error: "Ringkasan kejadian wajib diisi." });
      return;
    }

    setCardForm(id, { loading: true, error: "" });
    try {
      await laporanServices.create(id, {
        ringkasan,
        tindakLanjut: (form.tindakLanjut || "").trim() || null,
      });
      if (mountedRef.current) {
        setFormState(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        setPerluLaporan(prev => prev.filter(k => k.kejadianId !== id));
        await Promise.all([loadPerluLaporan(), loadRiwayat()]);
      }
    } catch (err) {
      setCardForm(id, {
        loading: false,
        error: err.response?.data?.message || "Gagal menyimpan laporan. Silakan coba lagi.",
      });
    }
  };

  const toggleDetail = async id => {
    const current = detailState[id];
    if (current && (current.data || current.notFiled)) {
      setDetailState(prev => ({ ...prev, [id]: { ...prev[id], open: !prev[id].open } }));
      return;
    }

    setDetailState(prev => ({ ...prev, [id]: { ...prev[id], open: true, loading: true, error: "" } }));
    try {
      const data = await laporanServices.get(id);
      if (mountedRef.current) {
        setDetailState(prev => ({ ...prev, [id]: { open: true, loading: false, error: "", data } }));
      }
    } catch (err) {
      if (!mountedRef.current) return;
      if (err.response?.status === 404) {
        setDetailState(prev => ({ ...prev, [id]: { open: true, loading: false, error: "", notFiled: true } }));
      } else {
        setDetailState(prev => ({
          ...prev,
          [id]: { open: true, loading: false, error: "Gagal memuat detail laporan." },
        }));
      }
    }
  };

  return (
    <PetugasLayout title="Laporan Kejadian" subtitle="Unit K3 dan Tanggung Jawab Sosial">
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#e31212]" />
          <h2 className="font-bold text-sm text-gray-800">Perlu Laporan</h2>
        </div>

        {perluError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <p className="text-xs text-red-700 font-medium">{perluError}</p>
          </div>
        )}

        {loadingPerlu && perluLaporan.length === 0 && !perluError && (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-[#0140c7] rounded-full animate-spin" />
            <p className="text-xs text-gray-500">Memuat data kejadian...</p>
          </div>
        )}

        {!loadingPerlu && perluLaporan.length === 0 && !perluError && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-2 text-center">
            <FileText className="w-8 h-8 text-gray-300" />
            <p className="text-xs text-gray-400">Tidak ada kejadian yang menunggu laporan penutup.</p>
          </div>
        )}

        {perluLaporan.map(k => {
          const form = formState[k.kejadianId] || {};
          const waktuAman = k.waktuDitetapkanAman || k.waktuPengumumanAman;
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
                {waktuAman && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>Dinyatakan aman {fmtTime(waktuAman)}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-xs text-gray-800">
                  Ringkasan Kejadian <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Jelaskan kronologi, dampak, dan penanganan yang telah dilakukan..."
                  value={form.ringkasan || ""}
                  onChange={e => setCardForm(k.kejadianId, { ringkasan: e.target.value, error: "" })}
                  className="border border-gray-200 rounded-xl p-3 text-sm bg-white outline-none w-full shadow-sm min-h-[90px]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-xs text-gray-800">Tindak Lanjut</label>
                <textarea
                  placeholder="Rekomendasi atau tindak lanjut yang perlu dilakukan (opsional)..."
                  value={form.tindakLanjut || ""}
                  onChange={e => setCardForm(k.kejadianId, { tindakLanjut: e.target.value })}
                  className="border border-gray-200 rounded-xl p-3 text-sm bg-white outline-none w-full shadow-sm min-h-[70px]"
                />
              </div>

              {form.error && <p className="text-xs text-red-600 font-medium">{form.error}</p>}

              <button
                type="button"
                disabled={form.loading || !(form.ringkasan || "").trim()}
                onClick={() => handleSubmitLaporan(k.kejadianId)}
                className="text-white rounded-xl h-12 flex items-center justify-center font-bold text-sm shadow-md gap-2 transition-all disabled:opacity-50 bg-[#0140c7] shadow-blue-200"
              >
                {form.loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Simpan &amp; Tutup Laporan
                  </>
                )}
              </button>
            </div>
          );
        })}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#0140c7]" />
          <h2 className="font-bold text-sm text-gray-800">Riwayat Laporan</h2>
        </div>

        {riwayatError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <p className="text-xs text-red-700 font-medium">{riwayatError}</p>
          </div>
        )}

        {loadingRiwayat && riwayat.length === 0 && !riwayatError && (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-[#0140c7] rounded-full animate-spin" />
            <p className="text-xs text-gray-500">Memuat riwayat laporan...</p>
          </div>
        )}

        {!loadingRiwayat && riwayat.length === 0 && !riwayatError && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-2 text-center">
            <History className="w-8 h-8 text-gray-300" />
            <p className="text-xs text-gray-400">Belum ada laporan yang tercatat.</p>
          </div>
        )}

        {riwayat.map(k => {
          const detail = detailState[k.kejadianId] || {};
          return (
            <div key={k.kejadianId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => toggleDetail(k.kejadianId)}
                className="w-full flex items-center justify-between gap-2 text-left"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-xs font-bold text-gray-500 tracking-wider">{k.kodeKejadian}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 shrink-0">
                      {KEJADIAN_STATUS_LABEL[k.status] || k.status}
                    </span>
                  </div>
                  <p className="font-bold text-sm text-gray-800 truncate">{k.jenisKejadian}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{k.lokasi}</span>
                    {k.waktuLapor && <span className="shrink-0">· {fmtDate(k.waktuLapor)}</span>}
                  </div>
                </div>
                {detail.open ? (
                  <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </button>

              {detail.open && (
                <div className="border-t border-gray-100 pt-2 flex flex-col gap-2">
                  {detail.loading && (
                    <div className="flex items-center gap-2 py-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-[#0140c7] rounded-full animate-spin" />
                      <p className="text-xs text-gray-500">Memuat detail laporan...</p>
                    </div>
                  )}
                  {detail.error && <p className="text-xs text-red-600 font-medium">{detail.error}</p>}
                  {detail.notFiled && (
                    <p className="text-xs text-gray-400">Laporan penutup belum dibuat untuk kejadian ini.</p>
                  )}
                  {detail.data && (
                    <div className="flex flex-col gap-2 text-xs">
                      <div>
                        <p className="font-bold text-gray-700">Ringkasan Kejadian</p>
                        <p className="text-gray-600 mt-0.5 whitespace-pre-wrap">{detail.data.ringkasan}</p>
                      </div>
                      {detail.data.tindakLanjut && (
                        <div>
                          <p className="font-bold text-gray-700">Tindak Lanjut</p>
                          <p className="text-gray-600 mt-0.5 whitespace-pre-wrap">{detail.data.tindakLanjut}</p>
                        </div>
                      )}
                      {detail.data.waktuLaporan && (
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>Laporan dibuat {fmtTime(detail.data.waktuLaporan)}, {fmtDate(detail.data.waktuLaporan)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </PetugasLayout>
  );
}
