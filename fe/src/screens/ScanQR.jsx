import { useState } from "react";
import { PageLayout } from "../components/PageLayout";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useNavigate, useLocation } from "react-router";
import { QrCode, CheckCircle2 } from "lucide-react";
export function ScanQR() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scanned, setScanned] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const routePrefix = location.pathname.startsWith("/hydrant") ? "hydrant" : location.pathname.startsWith("/emergency-box") ? "emergency-box" : "apar";
  const handleScan = result => {
    if (result && result.length > 0 && !scanned) {
      const text = result[0].rawValue;
      setScanned(text);
      setTimeout(() => {
        const lower = text.toLowerCase();
        if (lower.startsWith("apar")) {
          navigate(`/apar/${text.toUpperCase()}`);
        } else if (lower.startsWith("hyd")) {
          navigate(`/hydrant/${text.toUpperCase()}`);
        } else if (lower.startsWith("emb")) {
          navigate(`/emergency-box/${text.toUpperCase()}`);
        } else {
          navigate(`/${routePrefix}/${text}`);
        }
      }, 800);
    }
  };
  return <PageLayout title="Scan QR Code">
    <div className="flex flex-col h-full bg-gray-900">
      { }        <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {scanned ? <div className="flex flex-col items-center gap-4 text-center px-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <p className="text-white font-bold font-['Poppins',sans-serif]">QR Terdeteksi!</p>
          <p className="text-green-300 text-sm font-mono">{scanned}</p>
          <p className="text-gray-400 text-xs">Mengalihkan ke halaman detail...</p>
        </div> : cameraError ? <div className="flex flex-col items-center gap-4 text-center px-6">
          <QrCode className="w-16 h-16 text-gray-600" />
          <p className="text-gray-300 text-sm font-['Poppins',sans-serif]">{cameraError}</p>
        </div> : <>
          <Scanner onScan={handleScan} onError={() => setCameraError("Kamera tidak dapat diakses. Pastikan izin kamera sudah diberikan.")} components={{
            audio: false,
            tracker: true
          }} styles={{
            container: {
              width: "100%",
              height: "100%"
            }
          }} />
          { }          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-56 h-56">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#0140c7] rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#0140c7] rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#0140c7] rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#0140c7] rounded-br-xl" />
            </div>
          </div>
        </>}
      </div>

      { }      <div className="px-6 py-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-gray-500" />
          <p className="text-gray-400 text-xs font-['Poppins',sans-serif] text-center">
            Arahkan kamera ke QR Code pada alat untuk memulai inspeksi
          </p>
        </div>
        <button onClick={() => navigate(-1)} className="bg-white text-gray-800 px-10 py-3 rounded-full font-bold text-sm">
          Batal
        </button>
      </div>
    </div>
  </PageLayout>;
}