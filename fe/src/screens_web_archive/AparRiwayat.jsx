import { useParams, Link } from "react-router";
import { PageLayout } from "../components/PageLayout";
import { useApp } from "../context/AppContext";
import { CheckCircle2, AlertTriangle, FileText, ClipboardCheck } from "lucide-react";
import { useState, useEffect } from "react";

export function AparRiwayat() {
  const {
    id
  } = useParams();
  const {
    getInspeksiByEquipment
  } = useApp();
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getInspeksiByEquipment(id || "")
      .then(res => {
        if (active) {
          setRiwayat(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [id, getInspeksiByEquipment]);
  return <PageLayout title="Riwayat Inspeksi">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-['Poppins',sans-serif] font-extrabold text-xl text-[#0140c7]">{id}</h2>
          <span className="text-xs text-gray-500 font-medium">{riwayat.length} catatan</span>
        </div>

        {riwayat.length === 0 ? <div className="flex flex-col items-center justify-center py-16 gap-3">
            <ClipboardCheck className="w-12 h-12 text-gray-200" />
            <p className="text-sm text-gray-400 text-center font-['Poppins',sans-serif]">
              Belum ada riwayat inspeksi untuk alat ini.
            </p>
            <Link to={`/apar/${id}/inspeksi`} className="text-xs text-[#0140c7] font-semibold mt-1">
              Lakukan Inspeksi Sekarang →
            </Link>
          </div> : <div className="flex flex-col gap-3">
            {riwayat.map((item, index) => <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {item.status === "Aman" ? <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />}
                    <div>
                      <p className="text-sm font-bold text-gray-800">{item.tanggal}</p>
                      {index === 0 && <span className="text-[9px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-full">
                          Terbaru
                        </span>}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${item.status === "Aman" ? "bg-green-100 text-green-700" : item.status === "Rusak" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {item.status}
                  </span>
                </div>

                <div className="flex items-start gap-2 border-t border-gray-50 pt-2">
                  <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-gray-600 leading-relaxed">{item.catatan}</p>
                </div>

                <p className="text-[10px] text-gray-400 text-right">
                  Inspektor: {item.petugas}
                </p>
              </div>)}
          </div>}
      </div>
    </PageLayout>;
}