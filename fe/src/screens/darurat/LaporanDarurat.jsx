import { useState } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "../../components/PageLayout";
import { AlertCircle, MapPin, Camera } from "lucide-react";
import { kejadianServices } from "@/services/kejadianServices";

export function LaporanDarurat() {
  const navigate = useNavigate();
  const [jenis, setJenis] = useState("Kebakaran");
  const [lokasi, setLokasi] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    if (!lokasi.trim()) return;
    if (!confirmed) {
      setConfirmed(true);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await kejadianServices.alert({ jenisKejadian: jenis, lokasi, deskripsi });
      navigate(`/darurat/status/${res.kejadianId}`, {
        state: { kodeKejadian: res.kodeKejadian, jenis, lokasi }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Emergency Alert gagal dikirim. Silakan coba lagi.");
      setLoading(false);
      setConfirmed(false);
    }
  };

  return <PageLayout title="Emergency Alert">
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">

      { }      <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <p className="text-xs text-red-800 font-medium font-['Poppins',sans-serif]">
          Gunakan form ini HANYA untuk keadaan darurat nyata. Laporan palsu akan ditindak tegas sesuai peraturan Politeknik Astra.
        </p>
      </div>

      {jenis === "Gempa Bumi" && (
        <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-900 font-['Poppins',sans-serif]">
              EVAKUASI GEMPA BUMI LANGSUNG AKTIF
            </p>
            <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed font-['Poppins',sans-serif]">
              Saat terjadi gempa, evakuasi langsung diaktifkan untuk seluruh area. <strong>PIC Gempa & Floor Warden</strong> bertanggung jawab penuh dalam proses evakuasi.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-['Poppins',sans-serif] font-bold text-sm text-gray-800">
          Jenis Darurat
        </label>
        <select value={jenis} onChange={e => {
          setJenis(e.target.value);
          setConfirmed(false);
        }} className="border border-gray-200 rounded-xl p-3 text-sm bg-white outline-none w-full shadow-sm font-['Poppins',sans-serif]">
          <option>Kebakaran</option>
          <option>Gempa Bumi</option>
          <option>Kecelakaan Kerja</option>
          <option>Kebocoran Gas</option>
          <option>Banjir</option>
          <option>Lainnya</option>
        </select>
      </div>

      { }      <div className="flex flex-col gap-2">
        <label className="font-['Poppins',sans-serif] font-bold text-sm text-gray-800">
          Lokasi Kejadian <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Contoh: Gedung A Lantai 2, Laboratorium Kimia" value={lokasi} onChange={e => {
            setLokasi(e.target.value);
            setConfirmed(false);
          }} className="border border-gray-200 rounded-xl p-3 pl-10 text-sm bg-white outline-none w-full shadow-sm font-['Poppins',sans-serif]" required />
        </div>
      </div>

      { }      <div className="flex flex-col gap-2">
        <label className="font-['Poppins',sans-serif] font-bold text-sm text-gray-800">
          Deskripsi Singkat
        </label>
        <textarea placeholder="Jelaskan situasi saat ini, jumlah korban jika ada, dan kondisi sekitar..." value={deskripsi} onChange={e => {
          setDeskripsi(e.target.value);
          setConfirmed(false);
        }} className="border border-gray-200 rounded-xl p-3 text-sm bg-white outline-none w-full shadow-sm min-h-[90px] font-['Poppins',sans-serif]" />
      </div>

      { }      <div className="flex flex-col gap-2">
        <label className="font-['Poppins',sans-serif] font-bold text-sm text-gray-800">
          Bukti Foto (Opsional)
        </label>
        <button type="button" className="border-2 border-dashed border-gray-300 rounded-xl h-24 flex flex-col items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors">
          <Camera className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium font-['Poppins',sans-serif]">Ambil / Pilih Foto</span>
        </button>
      </div>

      { }      {confirmed && <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4">
        <p className="text-xs font-bold text-yellow-800 font-['Poppins',sans-serif]">
          Konfirmasi pengiriman Emergency Alert?
        </p>
        <p className="text-xs text-yellow-700 mt-1">
          Jenis: <strong>{jenis}</strong> · Lokasi: <strong>{lokasi}</strong>
        </p>
        <p className="text-[10px] text-yellow-600 mt-1">
          Klik tombol sekali lagi untuk mengirim.
        </p>
      </div>}

      {error && <p className="text-xs text-red-600 font-medium font-['Poppins',sans-serif]">{error}</p>}

      <button type="submit" disabled={loading} className={`text-white rounded-xl h-14 flex items-center justify-center font-bold shadow-lg mt-2 transition-all disabled:opacity-70 gap-2 font-['Poppins',sans-serif] ${confirmed ? "bg-[#e31212] shadow-red-300 animate-pulse" : "bg-[#e31212] shadow-red-200"}`}>
        {loading ? <>
          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          Mengirim Emergency Alert...
        </> : confirmed ? "KONFIRMASI & KIRIM ALERT" : "KIRIM EMERGENCY ALERT"}
      </button>
    </form>
  </PageLayout>;
}
