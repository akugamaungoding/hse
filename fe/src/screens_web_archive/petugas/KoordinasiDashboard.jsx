import { useCallback, useEffect, useRef, useState } from "react";
import { PetugasLayout } from "../../components/PetugasLayout";
import {
  Radio,
  ShieldCheck,
  Building2,
  Users,
  HeartPulse,
  Flame,
  MessageSquare,
  Clock,
} from "lucide-react";
import { useActiveKejadian } from "@/hooks/useActiveKejadian";
import { kejadianServices } from "@/services/kejadianServices";
import { koordinasiServices } from "@/services/koordinasiServices";
import { KEJADIAN_STATUS_LABEL } from "@/constants/routes";

const POLL_MS = 6000;
const SUDAH_AMAN_STATUS = ["Aman", "Selesai", "Bukan Darurat"];

function fmtTime(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
}

function StatusPill({ status }) {
  const label = KEJADIAN_STATUS_LABEL[status] || status;
  const color =
    status === "Aman" || status === "Selesai"
      ? "bg-green-100 text-green-700"
      : status === "Diumumkan"
        ? "bg-red-100 text-red-700"
        : status === "Evakuasi" || status === "Assembly Point" || status === "Penanganan"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-blue-100 text-blue-700";
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${color}`}>
      {label}
    </span>
  );
}

export function KoordinasiDashboard() {
  const { kejadian } = useActiveKejadian();
  const [status, setStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [statusError, setStatusError] = useState("");

  const [amanArming, setAmanArming] = useState(false);
  const [amanLoading, setAmanLoading] = useState(false);
  const [amanError, setAmanError] = useState("");

  const [catatan, setCatatan] = useState("");
  const [catatanLoading, setCatatanLoading] = useState(false);
  const [catatanError, setCatatanError] = useState("");

  const mountedRef = useRef(true);

  const loadStatus = useCallback(kejadianId => {
    if (!kejadianId) return Promise.resolve();
    return kejadianServices
      .getStatus(kejadianId)
      .then(data => {
        if (mountedRef.current) {
          setStatus(data || null);
          setStatusError("");
        }
      })
      .catch(() => {
        if (mountedRef.current) setStatusError("Gagal memuat rangkuman situasi.");
      })
      .finally(() => {
        if (mountedRef.current) setLoadingStatus(false);
      });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (!kejadian?.kejadianId) {
      setStatus(null);
      setLoadingStatus(false);
      return () => {
        mountedRef.current = false;
      };
    }

    setLoadingStatus(true);
    loadStatus(kejadian.kejadianId);
    const t = setInterval(() => loadStatus(kejadian.kejadianId), POLL_MS);
    return () => {
      mountedRef.current = false;
      clearInterval(t);
    };
  }, [kejadian?.kejadianId, loadStatus]);

  const handleArmAman = () => {
    setAmanArming(true);
    setAmanError("");
  };

  const handleCancelAman = () => {
    setAmanArming(false);
    setAmanError("");
  };

  const handleTetapkanAman = async () => {
    if (!kejadian?.kejadianId) return;
    setAmanLoading(true);
    setAmanError("");
    try {
      await koordinasiServices.tetapkanAman(kejadian.kejadianId);
      setAmanLoading(false);
      setAmanArming(false);
      await loadStatus(kejadian.kejadianId);
    } catch (err) {
      setAmanLoading(false);
      setAmanError(err.response?.data?.message || "Gagal menetapkan kondisi aman. Silakan coba lagi.");
    }
  };

  const handleSubmitCatatan = async e => {
    e.preventDefault();
    if (!kejadian?.kejadianId || !catatan.trim()) return;
    setCatatanLoading(true);
    setCatatanError("");
    try {
      await koordinasiServices.update(kejadian.kejadianId, catatan.trim());
      setCatatan("");
      setCatatanLoading(false);
      await loadStatus(kejadian.kejadianId);
    } catch (err) {
      setCatatanLoading(false);
      setCatatanError(err.response?.data?.message || "Gagal mengirim update koordinasi. Silakan coba lagi.");
    }
  };

  if (!kejadian) {
    return (
      <PetugasLayout title="Koordinasi Kejadian" subtitle="Kepala KTID">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center gap-3 text-center">
          <Radio className="w-8 h-8 text-gray-300" />
          <p className="text-xs text-gray-400">
            Tidak ada kejadian tanggap darurat yang sedang aktif saat ini.
          </p>
        </div>
      </PetugasLayout>
    );
  }

  const header = status?.header;
  const evakuasi = status?.evakuasi || [];
  const assembly = status?.assembly || null;
  const p3k = status?.p3k || null;
  const pemadaman = status?.pemadaman || null;
  const koordinasi = [...(status?.koordinasi || [])].sort(
    (a, b) => new Date(b.waktuUpdate) - new Date(a.waktuUpdate)
  );

  const totalLantai = evakuasi.length;
  const kosongCount = evakuasi.filter(e => e.status === "Kosong").length;

  const sudahAman = SUDAH_AMAN_STATUS.includes(kejadian.status);

  return (
    <PetugasLayout title="Koordinasi Kejadian" subtitle="Kepala KTID">
      { }      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-mono text-xs font-bold text-gray-500 tracking-wider">{kejadian.kodeKejadian}</p>
            <p className="font-bold text-sm text-gray-800 mt-0.5">{kejadian.jenisKejadian}</p>
          </div>
          <StatusPill status={kejadian.status} />
        </div>
        <p className="text-xs text-gray-500">{kejadian.lokasi}</p>
        {statusError && <p className="text-[10px] text-red-500 font-medium">{statusError}</p>}
      </div>

      { }      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#0140c7]" />
          <h2 className="font-bold text-sm text-gray-800">Ringkasan Situasi</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          { }          <div className="p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Building2 className="w-4.5 h-4.5 text-[#0140c7]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800">Evakuasi</p>
              {loadingStatus && !status ? (
                <p className="text-xs text-gray-400 mt-0.5">Memuat...</p>
              ) : totalLantai === 0 ? (
                <p className="text-xs text-gray-400 mt-0.5">Belum ada data evakuasi lantai.</p>
              ) : (
                <p className="text-xs text-gray-500 mt-0.5">
                  <span className="font-bold text-gray-800">
                    {kosongCount}/{totalLantai}
                  </span>{" "}
                  lantai kosong
                </p>
              )}
            </div>
          </div>

          { }          <div className="p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Users className="w-4.5 h-4.5 text-[#0140c7]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800">Assembly Point</p>
              {!assembly ? (
                <p className="text-xs text-gray-400 mt-0.5">Belum ada data assembly point.</p>
              ) : (
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                  <p className="text-xs text-gray-500">
                    <span className="font-bold text-gray-800">{assembly.totalHadir ?? 0}</span>
                    {" / "}
                    {assembly.totalTerdaftar ?? 0} hadir
                  </p>
                  {assembly.sudahDikonfirmasi && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      Sudah Dikonfirmasi
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          { }          <div className="p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <HeartPulse className="w-4.5 h-4.5 text-[#0140c7]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800">P3K</p>
              {!p3k ? (
                <p className="text-xs text-gray-400 mt-0.5">Belum ada laporan P3K.</p>
              ) : (
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                  <p className="text-xs text-gray-500">
                    {p3k.adaKorban ? `Ada korban (${p3k.jumlahKorban ?? "?"})` : "Tidak ada korban"}
                  </p>
                  {p3k.perluAmbulans && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                      Perlu Ambulans
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          { }          <div className="p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Flame className="w-4.5 h-4.5 text-[#0140c7]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800">Pemadaman</p>
              {!pemadaman ? (
                <p className="text-xs text-gray-400 mt-0.5">Belum ada laporan pemadaman.</p>
              ) : (
                <div className="flex flex-col gap-1 mt-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs text-gray-500">{pemadaman.sumberApi}</p>
                    {pemadaman.perluDamkar && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        Perlu DAMKAR
                      </span>
                    )}
                  </div>
                  {pemadaman.hasilPemadaman && (
                    <p className="text-xs text-gray-500">{pemadaman.hasilPemadaman}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      { }      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <h2 className="font-bold text-sm text-gray-800">Tetapkan Kondisi Aman</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
          {sudahAman ? (
            <p className="text-xs text-gray-500">
              Kondisi sudah ditetapkan aman.
            </p>
          ) : (
            <>
              <p className="text-xs text-gray-500">
                Sebagai Kepala KTID, Anda berwenang menetapkan kondisi aman setelah proses evakuasi dan
                pendataan assembly point dipastikan tuntas. Setelah ditetapkan, Control Room akan
                mengumumkan kondisi aman ke seluruh gedung.
              </p>

              {amanArming && (
                <div className="bg-green-50 border border-green-300 rounded-xl p-3">
                  <p className="text-xs font-bold text-green-800">
                    Konfirmasi penetapan kondisi aman untuk kejadian ini?
                  </p>
                  <p className="text-[10px] text-green-600 mt-1">Klik tombol sekali lagi untuk menetapkan.</p>
                </div>
              )}

              {amanError && <p className="text-xs text-red-600 font-medium">{amanError}</p>}

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={amanLoading}
                  onClick={() => (amanArming ? handleTetapkanAman() : handleArmAman())}
                  className={`flex-1 text-white rounded-xl h-12 flex items-center justify-center font-bold text-sm shadow-md gap-2 transition-all disabled:opacity-70 ${amanArming ? "bg-green-600 shadow-green-300 animate-pulse" : "bg-green-600 shadow-green-200"
                    }`}
                >
                  {amanLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Menetapkan...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      {amanArming ? "KONFIRMASI TETAPKAN AMAN" : "Tetapkan Kondisi Aman"}
                    </>
                  )}
                </button>
                {amanArming && !amanLoading && (
                  <button
                    type="button"
                    onClick={handleCancelAman}
                    className="px-4 rounded-xl border border-gray-200 text-gray-500 text-xs font-bold"
                  >
                    Batal
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      { }      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#0140c7]" />
          <h2 className="font-bold text-sm text-gray-800">Log Koordinasi</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
          <form onSubmit={handleSubmitCatatan} className="flex flex-col gap-2">
            <textarea
              value={catatan}
              onChange={e => setCatatan(e.target.value)}
              placeholder="Tulis update koordinasi untuk semua pihak terkait..."
              className="border border-gray-200 rounded-xl p-3 text-sm bg-white outline-none w-full shadow-sm min-h-[80px] font-['Poppins',sans-serif]"
            />
            {catatanError && <p className="text-xs text-red-600 font-medium">{catatanError}</p>}
            <button
              type="submit"
              disabled={catatanLoading || !catatan.trim()}
              className="self-end bg-[#0140c7] text-white rounded-xl px-5 h-10 flex items-center justify-center font-bold text-xs shadow-md shadow-blue-200 gap-2 disabled:opacity-50"
            >
              {catatanLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Mengirim...
                </>
              ) : (
                "Kirim Update"
              )}
            </button>
          </form>

          <div className="flex flex-col gap-2 pt-1">
            {koordinasi.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Belum ada catatan koordinasi.</p>
            ) : (
              koordinasi.map((item, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-3 flex flex-col gap-1">
                  <p className="text-xs text-gray-700">{item.catatan}</p>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <span className="font-bold text-gray-500">{item.diupdateOlehNama}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {fmtTime(item.waktuUpdate)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </PetugasLayout>
  );
}
