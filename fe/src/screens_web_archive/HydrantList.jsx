import { useState } from "react";
import { Link } from "react-router";
import { PageLayout } from "../components/PageLayout";
import { Search, QrCode, CheckCircle2, AlertTriangle, Droplets, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAuthStore } from "@/store/useAuthStore";
import { AssetModal } from "../components/AssetModal";

const statusBadge = (status) => {
  if (status === "Aman") return "bg-green-100 text-green-700";
  return "bg-red-100 text-red-700";
};

const statusIcon = (status) => {
  if (status === "Aman") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  return <AlertTriangle className="w-4 h-4 text-red-500" />;
};

export function HydrantList() {
  const { hydrants } = useApp();
  const { roleCode } = useAuthStore();
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [modalOpen, setModalOpen] = useState(false);

  const canManage = ["SUPER_ADMIN", "SHE_AGENT", "UNIT_K3"].includes(roleCode);

  const filtered = hydrants.filter((h) => {
    const matchQuery =
      h.id.toLowerCase().includes(query.toLowerCase()) ||
      h.lokasi.toLowerCase().includes(query.toLowerCase());
    const matchStatus = filterStatus === "Semua" || h.status === filterStatus;
    return matchQuery && matchStatus;
  });

  return (
    <PageLayout title="Hydrant Box">
      <div className="p-4 flex flex-col gap-4 pb-20 relative">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-400 font-['Poppins',sans-serif]">
            Menampilkan {filtered.length} dari {hydrants.length} Hydrant Box
          </p>

          {canManage && (
            <button
              onClick={() => setModalOpen(true)}
              className="bg-[#0140c7] text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-blue-800 transition-colors"
            >
              <Plus className="w-4 h-4" /> Tambah Hydrant
            </button>
          )}
        </div>

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

        <div className="flex gap-2">
          {["Semua", "Aman", "Rusak"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                filterStatus === s
                  ? "bg-[#0140c7] text-white border-[#0140c7]"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">Tidak ada Hydrant Box yang cocok</p>
          ) : (
            filtered.map((hyd) => (
              <Link
                key={hyd.id}
                to={`/apar/${hyd.id}`}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2 active:scale-95 transition-transform"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {statusIcon(hyd.status)}
                    <div>
                      <h3 className="font-['Poppins',sans-serif] font-bold text-[#0140c7]">
                        {hyd.id}
                      </h3>
                      <p className="text-xs text-gray-500">{hyd.lokasi}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusBadge(
                      hyd.status
                    )}`}
                  >
                    {hyd.status}
                  </span>
                </div>
                <div className="flex justify-between items-end border-t border-gray-50 pt-2">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <Droplets className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <p className="text-xs text-gray-600 truncate">{hyd.detail}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 shrink-0 ml-2">
                    Terakhir: {hyd.lastInspeksi}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <Link
        to="/hydrant/scan"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#0140c7] rounded-full flex items-center justify-center shadow-lg text-white z-20"
      >
        <QrCode className="w-6 h-6" />
      </Link>

      <AssetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType="HYDRANT_BOX"
      />
    </PageLayout>
  );
}