import { FileText, AlertTriangle } from "lucide-react";
export function DashboardWidget() {
  return <div className="absolute left-[17px] top-[500px] w-[396px] flex flex-col gap-4 z-10 pb-[100px] h-[330px] overflow-y-auto custom-scrollbar">

    { }
    <div className="flex gap-3">
      <div className="flex-1 bg-blue-50 p-3 rounded-xl border border-blue-100 flex flex-col items-center justify-center">
        <p className="text-xs text-blue-600 font-bold mb-1">APAR</p>
        <div className="flex items-end gap-1">
          <h3 className="text-xl font-bold text-blue-800">42</h3>
          <span className="text-[10px] text-blue-600 mb-1">/ 45 Aman</span>
        </div>
      </div>
      <div className="flex-1 bg-green-50 p-3 rounded-xl border border-green-100 flex flex-col items-center justify-center">
        <p className="text-xs text-green-600 font-bold mb-1">Hydrant</p>
        <div className="flex items-end gap-1">
          <h3 className="text-xl font-bold text-green-800">12</h3>
          <span className="text-[10px] text-green-600 mb-1">/ 12 Aman</span>
        </div>
      </div>
      <div className="flex-1 bg-orange-50 p-3 rounded-xl border border-orange-100 flex flex-col items-center justify-center">
        <p className="text-xs text-orange-600 font-bold mb-1">E-Box</p>
        <div className="flex items-end gap-1">
          <h3 className="text-xl font-bold text-orange-800">8</h3>
          <span className="text-[10px] text-orange-600 mb-1">/ 10 Aman</span>
        </div>
      </div>
    </div>

    { }    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-['Poppins',sans-serif] font-bold text-sm text-gray-800">Kepatuhan Inspeksi Bulan Ini</h4>
        <span className="text-xs font-bold text-[#0140c7]">92%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
        <div className="bg-[#0140c7] h-2 rounded-full" style={{
          width: '92%'
        }}></div>
      </div>
      <p className="text-[10px] text-gray-500">Target kepatuhan perusahaan: 100%</p>
    </div>

    { }    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
      <h4 className="font-['Poppins',sans-serif] font-bold text-sm text-gray-800">Aktivitas Terbaru</h4>

      <div className="flex items-start gap-3 border-b border-gray-50 pb-2">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-[#0140c7]" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-800">Inspeksi APAR-012 selesai</p>
          <p className="text-[10px] text-gray-500">Oleh: Budi Santoso • 10 menit lalu</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4 text-red-600" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-800">Hydrant HYD-002 dilaporkan bocor</p>
          <p className="text-[10px] text-gray-500">Oleh: Anton • 2 jam lalu</p>
        </div>
      </div>
    </div>

  </div>;
}