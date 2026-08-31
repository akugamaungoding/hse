import { useState } from "react";
import { Link } from "react-router";
import { PageLayout } from "../components/PageLayout";
import { Search, QrCode, AlertTriangle, CheckCircle2, Clock, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAuthStore } from "@/store/useAuthStore";
import { AssetModal } from "../components/AssetModal";

const statusIcon = (status) => {
  if (status === "Aman") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  if (status === "Rusak") return <AlertTriangle className="w-4 h-4 text-red-500" />;
  return <Clock className="w-4 h-4 text-yellow-500" />;
};

const statusBadge = (status) => {
  if (status === "Aman") return "bg-green-100 text-green-700";
  if (status === "Rusak") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
};

export function AparList() {
  const { apars } = useApp();
  const { roleCode } = useAuthStore();
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [modalOpen, setModalOpen] = useState(false);

  const canManage = ["SUPER_ADMIN", "SHE_AGENT", "UNIT_K3"].includes(roleCode);

  const filtered = apars.filter((a) => {
    const matchQuery =
      a.id.toLowerCase().includes(query.toLowerCase()) ||
      a.lokasi.toLowerCase().includes(query.toLowerCase());
    const matchStatus = filterStatus === "Semua" || a.status === filterStatus;
    return matchQuery && matchStatus;
  });

  return (
    <PageLayout title="Daftar APAR">
      <div className="p-4 flex flex-col gap-4 pb-20 relative">
        {/* Action Header */}
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-400 font-['Poppins',sans-serif]">
            Menampilkan {filtered.length} dari {apars.length} APAR
          </p>

          {canManage && (
            <button
              onClick={() => setModalOpen(true)}
              className="bg-[#0140c7] text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-blue-800 transition-colors"
            >
              <Plus className="w-4 h-4" /> Tambah Aset
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-white rounded-xl px-3 h-11 shadow-sm border border-gray-100 gap-2">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari Kode atau Lokasi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 outline-none text-sm font-['Poppins',sans-serif]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {["Semua", "Aman", "Perlu Inspeksi", "Rusak"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                filterStatus === s
                  ? "bg-[#0140c7] text-white border-[#0140c7]"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Asset Cards */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">Tidak ada APAR yang cocok</p>
          ) : (
            filtered.map((apar) => (
              <div
                key={apar.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2 transition-all hover:border-blue-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {statusIcon(apar.status)}
                    <div>
                      <Link to={`/apar/${apar.id}`} className="font-['Poppins',sans-serif] font-bold text-[#0140c7] hover:underline">
                        {apar.id}
                      </Link>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <span>{apar.lokasi}</span>
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusBadge(
                      apar.status
                    )}`}
                  >
                    {apar.status}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-50 pt-2">
                  <p className="text-xs text-gray-600 font-medium">{apar.jenisDetail || apar.detail}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">Terakhir: {apar.lastInspeksi}</span>
                    <Link
                      to="/denah"
                      state={{ assetId: apar.id, lokasi: apar.lokasi }}
                      className="text-[10px] bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition-colors"
                      title={`Lihat Lokasi ${apar.id} (${apar.lokasi}) di Denah`}
                    >
                      Denah 📍
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating QR Scanner button */}
      <Link
        to="/apar/scan"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#0140c7] rounded-full flex items-center justify-center shadow-lg text-white z-20"
      >
        <QrCode className="w-6 h-6" />
      </Link>

      {/* Asset Modal for Creating Aset */}
      <AssetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType="APAR"
      />
    </PageLayout>
  );
}