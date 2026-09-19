import React, { useState, useEffect } from "react";
import { Download, X, Share, Smartphone } from "lucide-react";

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if already running in standalone PWA mode on mobile
    const isRunningStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    setIsStandalone(isRunningStandalone);

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if user dismissed prompt previously in this session
    const isDismissed = sessionStorage.getItem("hse_pwa_dismissed");
    if (isDismissed) setDismissed(true);

    // Capture Chrome/Android PWA install prompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  if (isStandalone || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("hse_pwa_dismissed", "true");
  };

  // Only show if prompt is available OR on iOS Safari
  if (!deferredPrompt && !isIOS) {
    return null;
  }

  return (
    <>
      <div className="fixed top-3 left-3 right-3 z-50 max-w-md mx-auto bg-gradient-to-r from-[#0140c7] to-[#1e5ee6] text-white p-3.5 rounded-2xl shadow-2xl border border-blue-400/30 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold font-['Poppins',sans-serif] leading-tight">
              Install HSE Mobile di HP
            </p>
            <p className="text-[11px] text-blue-100 truncate mt-0.5 font-['Poppins',sans-serif]">
              Akses cepat layar penuh seperti aplikasi native
            </p>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-white text-[#0140c7] font-bold text-xs rounded-xl shadow hover:bg-blue-50 active:scale-95 transition-all shrink-0 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="text-blue-200 hover:text-white p-1 rounded-lg shrink-0"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal panduan install khusus iPhone / iOS Safari */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-gray-800 shadow-2xl animate-in slide-in-from-bottom-6 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0140c7] flex items-center justify-center mb-4">
              <Share className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg font-['Poppins',sans-serif] text-gray-900">
              Cara Install di iPhone
            </h3>
            <ol className="mt-3 text-xs space-y-2.5 text-gray-600 font-['Poppins',sans-serif]">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#0140c7]">1.</span>
                <span>
                  Buka website ini di browser <strong>Safari</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#0140c7]">2.</span>
                <span>
                  Ketuk tombol <strong>Bagikan (Share)</strong> di bagian bawah layar.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#0140c7]">3.</span>
                <span>
                  Gulir ke bawah dan pilih <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>.
                </span>
              </li>
            </ol>
            <button
              onClick={() => setShowIosGuide(false)}
              className="mt-5 w-full bg-[#0140c7] text-white py-3 rounded-2xl font-bold text-sm shadow-md hover:bg-blue-700 active:scale-98 transition"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}
