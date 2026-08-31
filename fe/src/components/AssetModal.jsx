import { useState, useEffect } from "react";
import { X, Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";

export function AssetModal({ isOpen, onClose, initialData = null, defaultType = "APAR" }) {
  const { createAsset, updateAsset } = useApp();

  const [assetId, setAssetId] = useState("");
  const [tipe, setTipe] = useState(defaultType);
  const [lokasi, setLokasi] = useState("");
  const [detail, setDetail] = useState("");
  const [expiredDate, setExpiredDate] = useState("");
  const [status, setStatus] = useState("Aman");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!initialData;

  useEffect(() => {
    if (initialData) {
      setAssetId(initialData.id || "");
      setTipe(initialData.tipeRaw || defaultType);
      setLokasi(initialData.lokasi || "");
      setDetail(initialData.detail || "");
      setExpiredDate(initialData.expiredDate ? initialData.expiredDate.split("T")[0] : "");
      setStatus(initialData.status || "Aman");
    } else {
      setAssetId("");
      setTipe(defaultType);
      setLokasi("");
      setDetail("");
      setExpiredDate("");
      setStatus("Aman");
    }
    setError("");
  }, [initialData, defaultType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assetId.trim() || !lokasi.trim()) {
      setError("Kode Aset dan Lokasi wajib diisi.");
      return;
    }

    setSubmitting(true);
    setError("");

    const payload = {
      assetId: assetId.trim().toUpperCase(),
      tipe,
      lokasi: lokasi.trim(),
      detail: detail.trim() || null,
      expiredDate: expiredDate ? new Date(expiredDate).toISOString() : null,
      status,
    };

    let ok = false;
    if (isEdit) {
      ok = await updateAsset(initialData.id, payload);
    } else {
      ok = await createAsset(payload);
    }

    setSubmitting(false);
    if (ok) {
      onClose();
    } else {
      setError(isEdit ? "Gagal memperbarui data aset." : "Gagal membuat aset baru. Pastikan kode unik.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 font-['Poppins',sans-serif]">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#0140c7] text-white p-4 flex justify-between items-center">
          <h3 className="font-bold text-base flex items-center gap-2">
            {isEdit ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isEdit ? `Edit Aset: ${initialData?.id}` : "Tambah Aset Baru"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3 overflow-y-auto">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs font-bold border border-red-200">
              {error}
            </div>
          )}

          {/* Kode Aset */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">
              Kode / ID Aset <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              disabled={isEdit}
              placeholder="Contoh: A - CAGF - 10"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="border border-gray-200 rounded-xl p-2.5 text-xs bg-gray-50 uppercase font-bold outline-none disabled:bg-gray-200"
              required
            />
          </div>

          {/* Tipe Aset */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Kategori / Tipe Aset</label>
            <select
              value={tipe}
              onChange={(e) => setTipe(e.target.value)}
              className="border border-gray-200 rounded-xl p-2.5 text-xs bg-gray-50 font-semibold outline-none"
            >
              <option value="APAR">APAR</option>
              <option value="HYDRANT_BOX">Hydrant Box</option>
              <option value="POMPA_HYDRANT">Pompa Hydrant</option>
              <option value="EMERGENCY_BOX">Emergency Box</option>
              <option value="APD">APD Box</option>
            </select>
          </div>

          {/* Lokasi Aset */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">
              Lokasi Penempatan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Gedung A - Pintu Masuk TPM 1"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              className="border border-gray-200 rounded-xl p-2.5 text-xs bg-gray-50 font-medium outline-none"
              required
            />
          </div>

          {/* Detail Spesifikasi */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Spesifikasi / Detail</label>
            <input
              type="text"
              placeholder="Contoh: APAR CO2 5 Kg, Hydrant Box Indoor"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              className="border border-gray-200 rounded-xl p-2.5 text-xs bg-gray-50 outline-none"
            />
          </div>

          {/* Tanggal Kedaluwarsa */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Tanggal Kedaluwarsa</label>
            <input
              type="date"
              value={expiredDate}
              onChange={(e) => setExpiredDate(e.target.value)}
              className="border border-gray-200 rounded-xl p-2.5 text-xs bg-gray-50 outline-none font-medium"
            />
          </div>

          {/* Status Aset */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Status Kondisi Aset</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-200 rounded-xl p-2.5 text-xs bg-gray-50 font-bold text-gray-800 outline-none"
            >
              <option value="Aman">Aman (Normal)</option>
              <option value="Perlu Inspeksi">Perlu Inspeksi</option>
              <option value="Rusak">Rusak (Tidak Layak)</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 rounded-xl h-11 font-bold text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-2 bg-[#0140c7] text-white rounded-xl h-11 font-bold text-xs shadow-md hover:bg-blue-800 transition-colors flex items-center justify-center gap-1.5"
            >
              {submitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Aset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
