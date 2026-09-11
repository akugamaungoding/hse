import { useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { PageLayout } from "../components/PageLayout";
import { useApp } from "../context/AppContext";
import { CheckCircle2, AlertTriangle, Camera, ArrowLeft } from "lucide-react";
import { ASSET_SCHEMAS, ASSET_TYPE_NAMES } from "../constants/assetSchema";

export function AparInspeksi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addInspeksi } = useApp();

  // Determine asset type from URL path
  const assetCategory = useMemo(() => {
    const path = location.pathname;
    if (path.includes("hydrant") && !path.includes("pompa")) return "HYDRANT_BOX";
    if (path.includes("pompa-hydrant")) return "POMPA_HYDRANT";
    if (path.includes("emergency-box")) return "EMERGENCY_BOX";
    if (path.includes("apd")) return "APD";
    return "APAR";
  }, [location.pathname]);

  const schema = ASSET_SCHEMAS[assetCategory] || ASSET_SCHEMAS.APAR;
  const assetTitle = ASSET_TYPE_NAMES[assetCategory] || "Aset";

  // APAR subtype state (POWDER vs CO2)
  const [aparSubtype, setAparSubtype] = useState("POWDER");

  // Build initial form state based on schema
  const initialFormValues = useMemo(() => {
    const values = {};
    schema.parameters.forEach((param) => {
      values[param.id] = param.options[0]?.value || "";
    });
    if (assetCategory === "APAR" && schema.subtypes) {
      schema.subtypes.POWDER.forEach((param) => {
        values[param.id] = param.options[0]?.value || "";
      });
      schema.subtypes.CO2.forEach((param) => {
        values[param.id] = param.options[0]?.value || "";
      });
    }
    values.overallCondition = schema.overallConditionOptions[0];
    return values;
  }, [schema, assetCategory]);

  const [form, setForm] = useState(initialFormValues);
  const [catatan, setCatatan] = useState("");
  const [fotoBeforeUrl, setFotoBeforeUrl] = useState("");
  const [fotoAfterUrl, setFotoAfterUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Compute status OK/NOK for each selected parameter value
  const paramStatuses = useMemo(() => {
    const statuses = {};
    schema.parameters.forEach((param) => {
      const selectedOpt = param.options.find((o) => o.value === form[param.id]);
      statuses[param.id] = selectedOpt ? selectedOpt.status : "OK";
    });

    if (assetCategory === "APAR" && schema.subtypes) {
      const subtypeParams = schema.subtypes[aparSubtype] || [];
      subtypeParams.forEach((param) => {
        const selectedOpt = param.options.find((o) => o.value === form[param.id]);
        statuses[param.id] = selectedOpt ? selectedOpt.status : "OK";
      });
    }
    return statuses;
  }, [form, schema, assetCategory, aparSubtype]);

  // Overall status check
  const isAllOk = useMemo(() => {
    const hasNok = Object.values(paramStatuses).some((st) => st === "NOK");
    return !hasNok;
  }, [paramStatuses]);

  const calculatedOverallStatus = isAllOk ? "Aman" : "Rusak";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formDataPayload = JSON.stringify({
      assetCategory,
      aparSubtype: assetCategory === "APAR" ? aparSubtype : null,
      form,
      paramStatuses,
      overallCondition: form.overallCondition,
    });

    const primaryFotoUrl = fotoAfterUrl || fotoBeforeUrl || "";

    const ok = await addInspeksi(
      id || "",
      assetCategory.toLowerCase(),
      calculatedOverallStatus,
      catatan || "Inspeksi berkala aset.",
      primaryFotoUrl,
      formDataPayload
    );

    if (ok) {
      setSubmitted(true);
    } else {
      alert("Gagal menyimpan data inspeksi. Silakan coba lagi.");
    }
    setSubmitting(false);
  };

  const getBackPath = () => {
    if (assetCategory === "HYDRANT_BOX") return `/hydrant/${id}`;
    if (assetCategory === "POMPA_HYDRANT") return `/pompa-hydrant/${id}`;
    if (assetCategory === "EMERGENCY_BOX") return `/emergency-box/${id}`;
    if (assetCategory === "APD") return `/apd/${id}`;
    return `/apar/${id}`;
  };

  if (submitted) {
    return (
      <PageLayout title={`Form Inspeksi ${assetTitle}`}>
        <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-['Poppins',sans-serif] font-bold text-xl text-gray-800">
            Inspeksi Tersimpan!
          </h2>
          <p className="text-sm text-gray-500">
            Hasil inspeksi untuk <span className="font-bold text-[#0140c7]">{id}</span> berhasil disimpan ke database.
          </p>
          <div className="flex flex-col gap-2 w-full mt-4">
            <button
              onClick={() => navigate(`${getBackPath()}/riwayat`)}
              className="bg-[#0140c7] text-white rounded-xl h-12 font-bold text-sm"
            >
              Lihat Riwayat Inspeksi
            </button>
            <button
              onClick={() => navigate(getBackPath())}
              className="bg-gray-100 text-gray-700 rounded-xl h-12 font-bold text-sm"
            >
              Kembali ke Detail Aset
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const renderParamRow = (param) => {
    const currentVal = form[param.id] || "";
    const status = paramStatuses[param.id] || "OK";

    return (
      <tr key={param.id} className="border-b border-gray-100 text-xs font-['Poppins',sans-serif]">
        <td className="py-2.5 px-2 font-medium text-gray-800">
          {param.label}
        </td>
        {param.jumlah && (
          <td className="py-2.5 px-2 text-center text-gray-600 font-semibold">
            {param.jumlah}
          </td>
        )}
        <td className="py-2.5 px-2">
          <select
            value={currentVal}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                [param.id]: e.target.value,
              }))
            }
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 text-xs outline-none focus:border-blue-500 font-medium"
          >
            {param.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.value}
              </option>
            ))}
          </select>
        </td>
        <td className="py-2.5 px-2 text-center">
          <span
            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
              status === "OK"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300 animate-pulse"
            }`}
          >
            {status}
          </span>
        </td>
      </tr>
    );
  };

  return (
    <PageLayout title={`Form Inspeksi ${assetTitle}`}>
      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4 pb-24">
        {/* Asset Header Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              ID Inventaris
            </span>
            <p className="font-['Poppins',sans-serif] font-bold text-gray-900 text-base">
              {id}
            </p>
          </div>
          <span className="bg-blue-50 text-[#0140c7] font-bold text-xs px-3 py-1 rounded-full border border-blue-100">
            {assetTitle}
          </span>
        </div>

        {/* APAR Subtype Selector */}
        {assetCategory === "APAR" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-700 font-['Poppins',sans-serif]">
              Tipe APAR (Powder / CO2)
            </label>
            <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setAparSubtype("POWDER")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  aparSubtype === "POWDER"
                    ? "bg-[#0140c7] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                APAR POWDER
              </button>
              <button
                type="button"
                onClick={() => setAparSubtype("CO2")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  aparSubtype === "CO2"
                    ? "bg-[#0140c7] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                APAR CO2
              </button>
            </div>
          </div>
        )}

        {/* Parameter Table Restructure */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h3 className="font-['Poppins',sans-serif] font-bold text-gray-800 text-sm">
              Parameter Inspeksi & Status
            </h3>
            <span className="text-[10px] text-gray-400">Restrukturisasi Aset</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 bg-gray-50 uppercase">
                  <th className="py-2 px-2">Parameter</th>
                  {schema.parameters.some((p) => p.jumlah) && (
                    <th className="py-2 px-2 text-center">Jumlah</th>
                  )}
                  <th className="py-2 px-2">Isian</th>
                  <th className="py-2 px-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {schema.parameters.map((param) => renderParamRow(param))}

                {assetCategory === "APAR" &&
                  schema.subtypes &&
                  schema.subtypes[aparSubtype]?.map((param) => renderParamRow(param))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overall Asset Condition Selector */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2">
          <label className="font-['Poppins',sans-serif] font-bold text-gray-800 text-sm">
            Kondisi Kelayakan Aset (Kondisi Overall)
          </label>
          <select
            value={form.overallCondition}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                overallCondition: e.target.value,
              }))
            }
            className="w-full border border-gray-200 rounded-xl p-2.5 text-xs bg-gray-50 font-bold text-gray-800 outline-none focus:border-blue-500"
          >
            {schema.overallConditionOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Status Result Banner */}
        <div
          className={`rounded-xl p-3 flex items-center justify-between border ${
            isAllOk
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {isAllOk ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <div>
              <p className="text-xs font-bold">
                Kondisi Hasil: {calculatedOverallStatus}
              </p>
              <p className="text-[10px] text-gray-600">
                {isAllOk
                  ? "Semua parameter memenuhi standar OK"
                  : "Terdapat parameter bernilai NOK (Perlu tindakan lanjut)"}
              </p>
            </div>
          </div>
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
              isAllOk ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
            }`}
          >
            {isAllOk ? "Siap Digunakan" : "Tidak Layak"}
          </span>
        </div>

        {/* Dual Photo Upload: Before & After */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
          <h3 className="font-['Poppins',sans-serif] font-bold text-gray-800 text-sm">
            Foto Kondisi Before & After
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* Foto Before */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-gray-600">Foto Before (Sebelum)</span>
              {fotoBeforeUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-[4/3] bg-gray-50">
                  <img src={fotoBeforeUrl} alt="Before" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFotoBeforeUrl("")}
                    className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 text-[9px] font-bold"
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl py-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                  <Camera className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-[10px] text-gray-500 font-medium">Unggah Before</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setFotoBeforeUrl(ev.target?.result || "");
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Foto After */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-gray-600">Foto After (Sesudah)</span>
              {fotoAfterUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-[4/3] bg-gray-50">
                  <img src={fotoAfterUrl} alt="After" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFotoAfterUrl("")}
                    className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 text-[9px] font-bold"
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl py-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                  <Camera className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-[10px] text-gray-500 font-medium">Unggah After</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setFotoAfterUrl(ev.target?.result || "");
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Catatan Tambahan */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2">
          <label className="font-['Poppins',sans-serif] font-bold text-gray-800 text-sm">
            Catatan Inspeksi
          </label>
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Tulis catatan kondisi atau perbaikan disini..."
            className="w-full border border-gray-200 rounded-xl p-3 text-xs bg-gray-50 outline-none min-h-[80px] font-['Poppins',sans-serif]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate(getBackPath())}
            className="flex-1 bg-gray-100 text-gray-700 rounded-xl h-12 font-bold text-sm flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-2 bg-[#0140c7] text-white rounded-xl h-12 font-bold text-sm shadow-md hover:bg-blue-800 transition-colors flex items-center justify-center"
          >
            {submitting ? "Menyimpan..." : "Simpan Inspeksi Aset"}
          </button>
        </div>
      </form>
    </PageLayout>
  );
}