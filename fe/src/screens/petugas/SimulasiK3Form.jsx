import { useState, useEffect } from "react";
import { PetugasLayout } from "../../components/PetugasLayout";
import { Megaphone, Clock, MapPin, CheckCircle2, AlertCircle, Trash2, Send } from "lucide-react";

export function SimulasiK3Form() {
  const [namaSimulasi, setNamaSimulasi] = useState("Simulasi Kebakaran & Evakuasi Kampus");
  const [jamMulai, setJamMulai] = useState("09:00 WIB");
  const [jamSelesai, setJamSelesai] = useState("11:00 WIB");
  const [lokasi, setLokasi] = useState("Seluruh Area Kampus ASTRAtech");
  const [pesan, setPesan] = useState(
    "Hari ini akan diadakan simulasi emergency tanggap darurat dari pukul 09:00 WIB s.d. 11:00 WIB di Seluruh Area Kampus ASTRAtech. Seluruh civitas & petugas diharapkan tetap tenang dan tidak perlu panik / khawatir."
  );

  const [activeAnnouncement, setActiveAnnouncement] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("SIMULASI_ANNOUNCEMENT");
    if (saved) {
      try {
        setActiveAnnouncement(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleTimeLocationChange = (newMulai, newSelesai, newLokasi) => {
    setPesan(
      `Hari ini akan diadakan simulasi emergency tanggap darurat dari pukul ${newMulai} s.d. ${newSelesai} di ${newLokasi}. Seluruh civitas & petugas diharapkan tetap tenang dan tidak perlu panik / khawatir.`
    );
  };

  const handleKirim = (e) => {
    e.preventDefault();
    if (!namaSimulasi || !jamMulai || !jamSelesai || !lokasi) {
      alert("Mohon lengkapi seluruh field pengumuman simulasi.");
      return;
    }

    const payload = {
      id: "sim-" + Date.now(),
      namaSimulasi,
      jamMulai,
      jamSelesai,
      lokasi,
      pesan,
      createdAt: new Date().toISOString(),
    };

    // Save active simulation announcement
    localStorage.setItem("SIMULASI_ANNOUNCEMENT", JSON.stringify(payload));
    setActiveAnnouncement(payload);

    // Save to notifications list for all users
    const notifItem = {
      id: "notif-sim-" + Date.now(),
      title: `📢 SIMULASI EMERGENCY: ${namaSimulasi}`,
      desc: pesan,
      time: "Baru saja",
      tipe: "Simulasi",
      isUnread: true,
      createdAt: new Date().toISOString(),
    };

    const existingNotifs = JSON.parse(localStorage.getItem("LOCAL_NOTIFIKASI_LIST") || "[]");
    localStorage.setItem("LOCAL_NOTIFIKASI_LIST", JSON.stringify([notifItem, ...existingNotifs]));

    // Trigger custom window events so all tabs / components update
    window.dispatchEvent(new Event("simulasi-updated"));
    window.dispatchEvent(new Event("storage"));

    setSuccessMsg("Pengumuman simulasi emergency berhasil disiarkan ke seluruh role!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleHapus = () => {
    if (confirm("Apakah Anda yakin ingin mengakhiri / menghapus pengumuman simulasi ini?")) {
      localStorage.removeItem("SIMULASI_ANNOUNCEMENT");
      setActiveAnnouncement(null);
      window.dispatchEvent(new Event("simulasi-updated"));
      window.dispatchEvent(new Event("storage"));
      setSuccessMsg("Pengumuman simulasi telah diakhiri.");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  return (
    <PetugasLayout title="Pengumuman Simulasi K3" subtitle="Unit K3 (Kesehatan & Keselamatan Kerja)">
      <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1 pb-10">
        {/* Success Alert */}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-xs">
            <CheckCircle2 size={18} className="text-green-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Active Announcement Card Status */}
        {activeAnnouncement ? (
          <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-md flex flex-col gap-2 relative overflow-hidden">
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                STATUS: PENGUMUMAN AKTIF
              </span>
              <button
                onClick={handleHapus}
                className="text-[11px] bg-red-500 hover:bg-red-600 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Trash2 size={13} /> Akhiri Simulasi
              </button>
            </div>

            <div className="z-10 mt-1">
              <h3 className="font-extrabold text-sm text-white">{activeAnnouncement.namaSimulasi}</h3>
              <p className="text-xs text-blue-100 mt-1">
                Waktu: <strong>{activeAnnouncement.jamMulai} - {activeAnnouncement.jamSelesai}</strong>
              </p>
              <p className="text-xs text-blue-100">Lokasi: {activeAnnouncement.lokasi}</p>
              <div className="mt-2 bg-blue-700/60 p-2.5 rounded-xl border border-blue-400/40 text-xs italic text-blue-50">
                "{activeAnnouncement.pesan}"
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3.5 rounded-2xl text-xs flex items-start gap-2.5">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Belum Ada Pengumuman Simulasi Aktif</p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Gunakan form di bawah ini untuk menyiarkan informasi latihan simulasi emergency ke seluruh civitas & petugas.
              </p>
            </div>
          </div>
        )}

        {/* Announcement Input Form */}
        <form onSubmit={handleKirim} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Megaphone className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-xs text-gray-800">Form Pengumuman Simulasi (Khusus Role K3)</h3>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Nama / Judul Simulasi</label>
            <input
              type="text"
              value={namaSimulasi}
              onChange={(e) => setNamaSimulasi(e.target.value)}
              placeholder="Contoh: Simulasi Kebakaran Gedung A"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" /> Jam Mulai
              </label>
              <input
                type="text"
                value={jamMulai}
                onChange={(e) => {
                  setJamMulai(e.target.value);
                  handleTimeLocationChange(e.target.value, jamSelesai, lokasi);
                }}
                placeholder="09:00 WIB"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" /> Jam Selesai
              </label>
              <input
                type="text"
                value={jamSelesai}
                onChange={(e) => {
                  setJamSelesai(e.target.value);
                  handleTimeLocationChange(jamMulai, e.target.value, lokasi);
                }}
                placeholder="11:00 WIB"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-400" /> Lokasi / Area Simulasi
            </label>
            <input
              type="text"
              value={lokasi}
              onChange={(e) => {
                setLokasi(e.target.value);
                handleTimeLocationChange(jamMulai, jamSelesai, e.target.value);
              }}
              placeholder="Seluruh Area Kampus"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Pesan Himbauan (Siaran All Role)</label>
            <textarea
              rows={3}
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              placeholder="Tuliskan isi himbauan..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0b5cff] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all mt-1"
          >
            <Send size={15} /> Kirim Pengumuman ke Semua Role
          </button>
        </form>
      </div>
    </PetugasLayout>
  );
}
