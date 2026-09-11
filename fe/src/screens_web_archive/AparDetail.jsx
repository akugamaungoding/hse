import { useParams, Link, useNavigate } from "react-router";
import { PageLayout } from "../components/PageLayout";
import { useApp } from "../context/AppContext";
import { useAuthStore } from "@/store/useAuthStore";
import { AssetModal } from "../components/AssetModal";
import {
  MapPin,
  Flame,
  Weight,
  Calendar,
  ClipboardCheck,
  History,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Droplets,
  Package,
  Shield,
  Edit2,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";

const statusConfig = {
  Aman: {
    badge: "bg-green-100 text-green-700",
    icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
  },
  "Perlu Inspeksi": {
    badge: "bg-yellow-100 text-yellow-700",
    icon: <Clock className="w-5 h-5 text-yellow-600" />,
  },
  Rusak: {
    badge: "bg-red-100 text-red-700",
    icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
  },
};

export function AparDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { roleCode } = useAuthStore();
  const { apars, hydrants, emergencyBoxes, pompas, apds, getInspeksiByEquipment, deleteAsset } =
    useApp();

  const [riwayat, setRiwayat] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canManage = ["SUPER_ADMIN", "SHE_AGENT", "UNIT_K3"].includes(roleCode);

  const allAssets = [...apars, ...hydrants, ...emergencyBoxes, ...pompas, ...apds];
  const apar = allAssets.find((a) => a.id === id);

  useEffect(() => {
    let active = true;
    getInspeksiByEquipment(id || "")
      .then((res) => {
        if (active) {
          setRiwayat(res);
          setLoadingHistory(false);
        }
      })
      .catch(() => {
        if (active) setLoadingHistory(false);
      });
    return () => {
      active = false;
    };
  }, [id, getInspeksiByEquipment]);

  const handleDelete = async () => {
    if (!window.confirm(`Yakin ingin menghapus data aset ${id}?`)) return;
    setDeleting(true);
    const ok = await deleteAsset(id);
    setDeleting(false);
    if (ok) {
      navigate(-1);
    } else {
      alert("Gagal menghapus data aset.");
    }
  };

  if (!apar) {
    return (
      <PageLayout title="Detail Aset">
        <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-300" />
          <p className="text-sm text-gray-500 font-['Poppins',sans-serif]">
            Data Aset <span className="font-bold">{id}</span> tidak ditemukan.
          </p>
          <Link to="/utama" className="text-xs text-[#0140c7] font-semibold">
            ← Kembali ke Beranda
          </Link>
        </div>
      </PageLayout>
    );
  }

  const cfg = statusConfig[apar.status] ?? statusConfig["Aman"];

  const isApar = apar.tipeRaw === "APAR";
  const iconTipe =
    apar.tipeRaw === "APAR" ? (
      <Flame className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
    ) : apar.tipeRaw === "HYDRANT_BOX" || apar.tipeRaw === "POMPA_HYDRANT" ? (
      <Droplets className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
    ) : apar.tipeRaw === "EMERGENCY_BOX" ? (
      <Package className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
    ) : (
      <Shield className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
    );

  const labelTipe =
    apar.tipeRaw === "APAR"
      ? "Jenis APAR"
      : apar.tipeRaw === "HYDRANT_BOX"
      ? "Spesifikasi Hydrant Box"
      : apar.tipeRaw === "POMPA_HYDRANT"
      ? "Spesifikasi Pompa"
      : apar.tipeRaw === "EMERGENCY_BOX"
      ? "Kelengkapan Box"
      : "Kelengkapan APD";

  const lastInspeksi = riwayat[0];

  return (
    <PageLayout title={`Detail ${apar.jenis}`}>
      <div className="p-4 flex flex-col gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-['Poppins',sans-serif] font-extrabold text-2xl text-[#0140c7]">
                {apar.id}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">{apar.jenis} Unit</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${cfg.badge}`}>
                {cfg.icon}
                <span className="text-xs font-bold">{apar.status}</span>
              </div>
            </div>
          </div>

          {/* Manage CRUD action buttons */}
          {canManage && (
            <div className="flex gap-2 mb-4 pb-3 border-b border-gray-100">
              <button
                onClick={() => setEditModalOpen(true)}
                className="flex-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl h-9 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-amber-100 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Data Aset
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-50 text-red-600 border border-red-200 rounded-xl px-3 h-9 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Hapus
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400">Lokasi</p>
                  <p className="text-sm font-semibold text-gray-800">{apar.lokasi}</p>
                </div>
              </div>
              <Link
                to="/denah"
                state={{ assetId: apar.id, lokasi: apar.lokasi }}
                className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold px-3 py-1 rounded-lg flex items-center gap-1 transition-colors shrink-0 shadow-2xs"
                title={`Lihat Lokasi ${apar.id} di Denah`}
              >
                Lihat di Denah 📍
              </Link>
            </div>
            <div className="flex items-start gap-3">
              {iconTipe}
              <div>
                <p className="text-[10px] text-gray-400">{labelTipe}</p>
                <p className="text-sm font-semibold text-gray-800">
                  {isApar ? apar.jenisDetail : apar.detail || "-"}
                </p>
              </div>
            </div>
            {isApar && (
              <>
                {apar.berat && (
                  <div className="flex items-start gap-3">
                    <Weight className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-400">Berat</p>
                      <p className="text-sm font-semibold text-gray-800">{apar.berat}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400">Kadaluarsa</p>
                    <p className="text-sm font-semibold text-gray-800">{apar.expired}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {loadingHistory ? (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 animate-pulse h-20 flex items-center justify-center">
            <span className="text-xs text-gray-400 font-medium font-['Poppins']">
              Memuat riwayat...
            </span>
          </div>
        ) : lastInspeksi ? (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <p className="text-xs font-bold text-blue-700 mb-1">Inspeksi Terakhir</p>
            <p className="text-sm font-semibold text-gray-800">{lastInspeksi.tanggal}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              oleh {lastInspeksi.petugas} · {lastInspeksi.status}
            </p>
            {lastInspeksi.fotoUrl && (
              <div className="mt-3 rounded-lg overflow-hidden border border-blue-200 aspect-[4/3] max-w-[200px]">
                <img
                  src={lastInspeksi.fotoUrl}
                  alt="Dokumentasi Kerusakan"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 mt-2">
          <Link
            to={
              apar.tipeRaw === "HYDRANT_BOX"
                ? `/hydrant/${id}/inspeksi`
                : apar.tipeRaw === "POMPA_HYDRANT"
                ? `/pompa-hydrant/${id}/inspeksi`
                : apar.tipeRaw === "EMERGENCY_BOX"
                ? `/emergency-box/${id}/inspeksi`
                : apar.tipeRaw === "APD"
                ? `/apd/${id}/inspeksi`
                : `/apar/${id}/inspeksi`
            }
            className="bg-[#0140c7] text-white rounded-xl h-12 flex items-center justify-center gap-2 font-bold text-sm shadow-md"
          >
            <ClipboardCheck className="w-5 h-5" />
            Lakukan Inspeksi
          </Link>
          <Link
            to={
              apar.tipeRaw === "HYDRANT_BOX"
                ? `/hydrant/${id}/riwayat`
                : apar.tipeRaw === "POMPA_HYDRANT"
                ? `/pompa-hydrant/${id}/riwayat`
                : apar.tipeRaw === "EMERGENCY_BOX"
                ? `/emergency-box/${id}/riwayat`
                : apar.tipeRaw === "APD"
                ? `/apd/${id}/riwayat`
                : `/apar/${id}/riwayat`
            }
            className="bg-white border-2 border-[#0140c7] text-[#0140c7] rounded-xl h-12 flex items-center justify-center gap-2 font-bold text-sm"
          >
            <History className="w-5 h-5" />
            Lihat Riwayat ({riwayat.length})
          </Link>
        </div>
      </div>

      <AssetModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialData={apar}
        defaultType={apar.tipeRaw}
      />
    </PageLayout>
  );
}