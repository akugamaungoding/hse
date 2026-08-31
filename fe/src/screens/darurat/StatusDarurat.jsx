import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router";
import { PageLayout } from "../../components/PageLayout";
import { CheckCircle2, Clock, AlertTriangle, Phone, Shield, Users, XCircle } from "lucide-react";
import { kejadianServices } from "@/services/kejadianServices";
import { KEJADIAN_STATUS_LABEL } from "@/constants/routes";

const STEPS = [
  { key: "Menunggu Validasi", label: "Laporan Terkirim", time: d => d.header?.waktuLapor },
  { key: "Tervalidasi", label: "Divalidasi Tim Identifikasi", time: d => d.header?.waktuValidasi },
  { key: "Diumumkan", label: "Diumumkan ke Seluruh Gedung", time: d => d.header?.waktuPengumumanDarurat },
  { key: "Evakuasi", label: "Evakuasi Berlangsung", time: d => d.header?.waktuPengumumanDarurat },
  { key: "Assembly Point", label: "Pendataan di Assembly Point", time: d => d.assembly?.waktuKonfirmasi },
  { key: "Penanganan", label: "Penanganan Berlangsung", time: null },
  { key: "Aman", label: "Kondisi Dinyatakan Aman", time: d => d.header?.waktuPengumumanAman },
  { key: "Selesai", label: "Laporan Ditutup", time: d => d.laporan?.waktuLaporan },
];

const STATUS_DESC = {
  "Menunggu Validasi": "Laporan Anda sedang diperiksa oleh Tim Identifikasi.",
  "Tervalidasi": "Kejadian tervalidasi. Menunggu pengumuman resmi dari Control Room.",
  "Diumumkan": "Segera evakuasi menuju titik kumpul terdekat mengikuti jalur evakuasi.",
  "Evakuasi": "Segera evakuasi menuju titik kumpul terdekat mengikuti jalur evakuasi.",
  "Assembly Point": "Lakukan absensi di titik kumpul (assembly point) Anda.",
  "Penanganan": "Tim tanggap darurat sedang menangani situasi di lokasi.",
  "Aman": "Kondisi telah dinyatakan aman oleh Kepala KTID.",
  "Selesai": "Kejadian telah selesai ditangani dan laporan telah ditutup."
};

function fmtTime(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
}

export function StatusDarurat() {
  const { id } = useParams();
  const location = useLocation();
  const navState = location.state;
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = () => {
      kejadianServices.getStatus(id)
        .then(res => { if (mounted) { setData(res); setError(""); } })
        .catch(() => { if (mounted) setError("Gagal memuat status terbaru."); });
    };
    load();
    const t = setInterval(load, 5000);
    return () => { mounted = false; clearInterval(t); };
  }, [id]);

  const header = data?.header;
  const status = header?.status;
  const kodeKejadian = header?.kodeKejadian || navState?.kodeKejadian || id;
  const jenis = header?.jenisKejadian || navState?.jenis || "-";
  const lokasi = header?.lokasi || navState?.lokasi || "-";

  if (!data && error) {
    return <PageLayout title="Status Penanganan">
      <div className="p-6 flex flex-col items-center text-center gap-3">
        <AlertTriangle className="w-10 h-10 text-red-500" />
        <p className="text-sm text-gray-600 font-['Poppins',sans-serif]">{error}</p>
        <p className="text-xs text-gray-400">ID kejadian: {kodeKejadian}</p>
      </div>
    </PageLayout>;
  }

  if (!data) {
    return <PageLayout title="Status Penanganan">
      <div className="p-8 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-[#0140c7] rounded-full animate-spin" />
        <p className="text-xs text-gray-500 font-['Poppins',sans-serif]">Memuat status kejadian...</p>
      </div>
    </PageLayout>;
  }

  if (status === "Bukan Darurat") {
    return <PageLayout title="Status Penanganan">
      <div className="p-4 flex flex-col gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="font-['Poppins',sans-serif] font-bold text-xl text-gray-800">Bukan Kejadian Darurat</h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Laporan Anda telah diperiksa oleh Tim Identifikasi dan dinyatakan bukan situasi tanggap darurat.
          </p>
          {header?.catatanValidasi && <p className="text-xs text-gray-600 mt-3 bg-gray-50 rounded-xl p-3 w-full">{header.catatanValidasi}</p>}
        </div>
        <Link to="/utama" className="bg-gray-800 text-white rounded-xl h-12 flex items-center justify-center font-bold text-sm gap-2 font-['Poppins',sans-serif]">
          <Shield className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </PageLayout>;
  }

  const statusIndex = STEPS.findIndex(s => s.key === status);
  const isFinal = status === "Aman" || status === "Selesai";

  return <PageLayout title="Status Penanganan">
    <div className="p-4 flex flex-col gap-4">

      { }      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isFinal ? "bg-green-100" : "bg-red-100"}`}>
          {isFinal ? <CheckCircle2 className="w-8 h-8 text-green-600" /> : <AlertTriangle className="w-8 h-8 text-red-600 animate-pulse" />}
        </div>
        <h2 className="font-['Poppins',sans-serif] font-bold text-xl text-gray-800">
          {KEJADIAN_STATUS_LABEL[status] || status}
        </h2>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          {STATUS_DESC[status]}
        </p>
        <div className="mt-4 px-4 py-2 bg-gray-100 rounded-full font-bold text-sm text-gray-700 tracking-wider font-mono">
          ID: {kodeKejadian}
        </div>
        <div className="mt-3 flex flex-col gap-1 text-xs text-gray-500">
          <p>Jenis: <span className="font-semibold text-gray-700">{jenis}</span></p>
          <p>Lokasi: <span className="font-semibold text-gray-700">{lokasi}</span></p>
        </div>
      </div>

      { }      {(status === "Evakuasi" || status === "Assembly Point") && <Link to="/darurat/assembly" state={{ kejadianId: header.kejadianId, kodeKejadian }} className="flex items-center justify-between bg-[#0140c7] text-white rounded-2xl px-5 py-4 shadow-md shadow-blue-200 active:scale-95 transition-transform">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="font-['Poppins',sans-serif] font-bold text-sm">Absen di Assembly Point</p>
            <p className="text-blue-100 text-xs">Konfirmasi kehadiran Anda di titik kumpul</p>
          </div>
        </div>
      </Link>}

      { }      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-['Poppins',sans-serif] font-bold text-gray-800 border-b pb-3 mb-4">
          Timeline Penanganan
        </h3>

        <div className="flex flex-col gap-4 relative">
          <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100" />

          {STEPS.map((step, i) => {
            const done = statusIndex > i || (statusIndex === i && status === "Selesai");
            const active = statusIndex === i && status !== "Selesai";
            const time = step.time ? fmtTime(step.time(data)) : null;
            return <div key={step.key} className={`flex gap-4 relative z-10 ${!done && !active ? "opacity-40" : ""}`}>
              <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shrink-0 ${done ? "bg-green-100" : active ? "bg-yellow-100" : "bg-gray-100"}`}>
                {done ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : active ? <Clock className="w-4 h-4 text-yellow-600 animate-spin" /> : <div className="w-2 h-2 rounded-full bg-gray-400" />}
              </div>
              <div className="pt-1">
                <h4 className="text-sm font-bold text-gray-800 font-['Poppins',sans-serif]">
                  {step.label}
                </h4>
                <p className="text-xs text-gray-500">{time || (active ? "Sedang berlangsung..." : "Menunggu")}</p>
              </div>
            </div>;
          })}
        </div>
      </div>

      { }      {data.evakuasi?.length > 0 && (status === "Evakuasi" || status === "Assembly Point" || status === "Penanganan") && <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-['Poppins',sans-serif] font-bold text-gray-800 border-b pb-3 mb-3">
          Status Evakuasi per Lantai
        </h3>
        <div className="flex flex-col gap-2">
          {data.evakuasi.map(ev => <div key={ev.evakuasiId} className="flex items-center justify-between text-xs">
            <span className="text-gray-600">{ev.gedung} - {ev.namaLantai}</span>
            <span className={`font-bold px-2 py-0.5 rounded-full ${ev.status === "Kosong" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {ev.status === "Kosong" ? "Sudah Kosong" : "Proses Evakuasi"}
            </span>
          </div>)}
        </div>
      </div>}

      <a
        href="https://wa.me/6285156350374"
        target="_blank"
        rel="noreferrer"
        className="bg-green-50 border border-green-200 hover:border-green-300 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900 font-['Poppins',sans-serif]">
              Emergency Call (WhatsApp)
            </p>
            <p className="text-xs font-bold text-green-700 mt-0.5">
              085156350374 — Shofi
            </p>
            <p className="text-[10px] text-gray-500">Departemen UPT Perangkat Lunak</p>
          </div>
        </div>
        <span className="text-[11px] bg-green-600 text-white font-bold px-3 py-1.5 rounded-xl shrink-0 shadow-xs">
          Hubungi WA →
        </span>
      </a>

      {isFinal && <Link to="/utama" className="bg-gray-800 text-white rounded-xl h-12 flex items-center justify-center font-bold text-sm gap-2 font-['Poppins',sans-serif]">
        <Shield className="w-4 h-4" />
        Kembali ke Beranda
      </Link>}
    </div>
  </PageLayout >;
}
