import { useState } from "react";
import { Link } from "react-router";
import { PageLayout } from "../components/PageLayout";
import { Search, QrCode, CheckCircle2, AlertTriangle, Shield } from "lucide-react";
import { useApp } from "../context/AppContext";

const statusBadge = (status) => {
  if (status === "Aman") return "bg-green-100 text-green-700";
  return "bg-red-100 text-red-700";
};

const statusIcon = (status) => {
  if (status === "Aman") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  return <AlertTriangle className="w-4 h-4 text-red-500" />;
};

export function ApdList() {
  const { apds } = useApp();
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  const filtered = apds.filter((a) => {
    const matchQuery = a.id.toLowerCase().includes(query.toLowerCase()) || a.lokasi.toLowerCase().includes(query.toLowerCase());
    const matchStatus = filterStatus === "Semua" || a.status === filterStatus;
    return matchQuery && matchStatus;
  });

  return (
    <PageLayout title="Daftar APD">
      <div className="p-4 flex flex-col gap-4">
        { }        <div className="flex items-center bg-white rounded-xl px-3 h-11 shadow-sm border border-gray-100 gap-2">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari Kode atau Lokasi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 outline-none text-sm font-['Poppins',sans-serif]"
          />
        </div>

        { }        <div className="flex gap-2">
          {["Semua", "Aman", "Rusak"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${filterStatus === s ? "bg-[#0140c7] text-white border-[#0140c7]" : "bg-white text-gray-600 border-gray-200"
                }`}
            >
              {s}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400">
          Menampilkan {filtered.length} dari {apds.length} APD
        </p>

        { }        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">Tidak ada APD yang cocok</p>
          ) : (
            filtered.map((apd) => (
              <Link
                key={apd.id}
                to={`/apar/${apd.id}`}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2 active:scale-95 transition-transform"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {statusIcon(apd.status)}
                    <div>
                      <h3 className="font-['Poppins',sans-serif] font-bold text-[#0140c7]">{apd.id}</h3>
                      <p className="text-xs text-gray-500">{apd.lokasi}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusBadge(apd.status)}`}>
                    {apd.status}
                  </span>
                </div>
                <div className="flex justify-between items-end border-t border-gray-50 pt-2">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <Shield className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <p className="text-xs text-gray-600 truncate">{apd.detail}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 shrink-0 ml-2">Terakhir: {apd.lastInspeksi}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <Link
        to="/apar/scan"
        className="absolute bottom-6 right-6 w-14 h-14 bg-[#0140c7] rounded-full flex items-center justify-center shadow-lg text-white"
      >
        <QrCode className="w-6 h-6" />
      </Link>
    </PageLayout>
  );
}
