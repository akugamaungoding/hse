import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { PageLayout } from "../../components/PageLayout";
import { Scanner } from "@yudiel/react-qr-scanner";
import { QrCode, CheckCircle2, AlertCircle, Keyboard, MapPin } from "lucide-react";
import { assemblyPointServices } from "@/services/assemblyPointServices";

export function AbsensiAssembly() {
  const navigate = useNavigate();
  const location = useLocation();
  const kejadianId = location.state?.kejadianId;
  const kodeKejadian = location.state?.kodeKejadian;

  const [selectedAssemblyPoint, setSelectedAssemblyPoint] = useState("AP-01");
  const [scanned, setScanned] = useState(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualKode, setManualKode] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const assemblyPoints = [
    { code: "AP-01", name: "Assembly Point 1 — Lapangan Utama" },
    { code: "AP-02", name: "Assembly Point 2 — Depan Parkiran" },
    { code: "AP-03", name: "Assembly Point 3 — Area Dormitory" },
  ];

  const submitAbsensi = async (kodeAssemblyPoint) => {
    if (!kejadianId) {
      setError("Kejadian tidak ditemukan. Kembali ke halaman status dan coba lagi.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await assemblyPointServices.scan(kejadianId, kodeAssemblyPoint);
      setSuccess(true);
      setTimeout(() => navigate(`/darurat/status/${kejadianId}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mencatat kehadiran. Pastikan kode assembly point benar.");
      setScanned(null);
      setLoading(false);
    }
  };

  const handleScan = (result) => {
    if (result && result.length > 0 && !scanned && !loading) {
      const text = result[0].rawValue;
      setScanned(text);
      submitAbsensi(text);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualKode.trim()) return;
    submitAbsensi(manualKode.trim().toUpperCase());
  };

  if (success) {
    return (
      <PageLayout title="Absensi Assembly Point">
        <div className="p-8 flex flex-col items-center justify-center text-center gap-4 h-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <p className="font-['Poppins',sans-serif] font-bold text-gray-800">Kehadiran Tercatat!</p>
          <p className="text-xs text-gray-500">Mengalihkan kembali ke status kejadian...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Absensi Assembly Point">
      <div className="flex flex-col h-full bg-[#f9fafb]">
        {/* Assembly Point Selection (3 Points) with Mandatory Setting Correlation */}
        <div className="bg-white border-b border-gray-200 p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#0140c7]" /> Titik Kumpul (3 Assembly Point)
            </span>
            <span className="text-[10px] bg-blue-100 text-[#0140c7] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
              🔒 Mandatori Setting Active
            </span>
          </div>
          <select
            value={selectedAssemblyPoint}
            onChange={(e) => setSelectedAssemblyPoint(e.target.value)}
            disabled={true}
            className="w-full border border-gray-200 rounded-xl p-2.5 text-xs font-bold bg-gray-100 text-gray-700 outline-none opacity-90 cursor-not-allowed"
          >
            {assemblyPoints.map((ap) => (
              <option key={ap.code} value={ap.code}>
                {ap.name}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-blue-700 font-semibold italic">
            *Skema Mandatori TiKum Aktif: Pemilihan TiKum dikunci otomatis berdasarkan area asal evakuasi Anda.
          </p>
        </div>

        {kodeKejadian && (
          <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 text-center">
            <p className="text-xs text-[#0140c7] font-semibold font-['Poppins',sans-serif]">
              Kejadian Aktif: {kodeKejadian}
            </p>
          </div>
        )}

        {!manualMode ? (
          <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-gray-900 min-h-[300px]">
            {loading ? (
              <div className="flex flex-col items-center gap-3 text-center px-6">
                <div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <p className="text-white text-sm font-['Poppins',sans-serif]">Mencatat kehadiran...</p>
              </div>
            ) : cameraError ? (
              <div className="flex flex-col items-center gap-4 text-center px-6">
                <QrCode className="w-16 h-16 text-gray-600" />
                <p className="text-gray-300 text-sm font-['Poppins',sans-serif]">{cameraError}</p>
              </div>
            ) : (
              <>
                <Scanner
                  onScan={handleScan}
                  onError={() => setCameraError("Kamera tidak dapat diakses. Pastikan izin kamera sudah diberikan.")}
                  components={{ audio: false, tracker: true }}
                  styles={{ container: { width: "100%", height: "100%" } }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-56 h-56">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#0140c7] rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#0140c7] rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#0140c7] rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#0140c7] rounded-br-xl" />
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center p-6 gap-4">
            <p className="text-xs text-gray-600 font-['Poppins',sans-serif]">
              Masukkan kode assembly point atau ID badge Anda (Input Manual / Free Text).
            </p>
            <form onSubmit={handleManualSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Contoh: AP-01 atau BADGE-1029"
                value={manualKode}
                onChange={(e) => setManualKode(e.target.value)}
                className="border border-gray-200 rounded-xl p-3 text-sm bg-white outline-none w-full shadow-sm font-['Poppins',sans-serif] uppercase font-bold"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#0140c7] text-white rounded-xl h-12 font-bold text-sm disabled:opacity-70 flex items-center justify-center gap-2 font-['Poppins',sans-serif]"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  "Konfirmasi Kehadiran Free Text / Scan"
                )}
              </button>
            </form>
          </div>
        )}

        {error && (
          <div className="px-4 pt-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs text-red-600 font-medium font-['Poppins',sans-serif]">{error}</p>
          </div>
        )}

        <div className="px-6 py-4 flex flex-col items-center gap-3">
          {!manualMode && (
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-gray-500" />
              <p className="text-gray-400 text-xs font-['Poppins',sans-serif] text-center">
                Arahkan kamera ke QR Code di titik kumpul untuk absen
              </p>
            </div>
          )}
          <button
            onClick={() => {
              setManualMode(!manualMode);
              setError("");
            }}
            className="flex items-center gap-1.5 text-xs text-[#0140c7] font-semibold font-['Poppins',sans-serif]"
          >
            <Keyboard className="w-3.5 h-3.5" />
            {manualMode ? "Gunakan Scan QR Code" : "Gunakan Free Text / Kode Manual"}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-100 text-gray-700 px-8 py-2 rounded-full font-bold text-xs"
          >
            Kembali
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
