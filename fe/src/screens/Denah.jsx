import { MobileContainer } from "../components/MobileContainer";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import {
  Download,
  Search,
  FileText,
  ExternalLink,
  X,
  Building,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  MapPin,
  Users,
  CheckCircle2,
  Shield,
  Compass,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router";
import { DENAH_PDF_LIST } from "../constants/denahList";

const FLOOR_MAPPING = {
  GF: "Lantai GF",
  "1": "Lantai 1",
  "2": "Lantai 2",
  "3": "Lantai 3",
  Parkiran: "Parkiran",
  Dormitori: "Dormitori",
};

// Mandatori Arahan Titik Kumpul (Assembly Point) Data
const MANDATORI_TITIK_KUMPUL = [
  {
    id: "TK-01",
    nama: "Titik Kumpul 1 (Utama - Lapangan Olahraga / Plaza)",
    targetFloors: ["Lantai GF", "Lantai 1"],
    status: "Aman / Aktif",
    warna: "bg-[#0b5cff]",
  },
  {
    id: "TK-02",
    nama: "Titik Kumpul 2 (Utara - Area Parkir Barat)",
    targetFloors: ["Lantai 2", "Parkiran"],
    status: "Aman / Aktif",
    warna: "bg-green-600",
  },
  {
    id: "TK-03",
    nama: "Titik Kumpul 3 (Selatan - Area Parkir Timur)",
    targetFloors: ["Lantai 3", "Dormitori"],
    status: "Aman / Aktif",
    warna: "bg-purple-600",
  },
];

const mapFloorToAreaId = (floorName) => {
  if (floorName === "Lantai GF") return "GF";
  if (floorName === "Lantai 1") return "1";
  if (floorName === "Lantai 2") return "2";
  if (floorName === "Lantai 3") return "3";
  if (floorName === "Parkiran") return "Parkiran";
  if (floorName === "Dormitori") return "Dormitori";
  return "GF";
};

const CIVITAS_ROOM_ID = "denah/Kampus/Lantai 2/Ruangan Kelas CB201.pdf";

export function Denah() {
  const location = useLocation();
  const [selectedArea, setSelectedArea] = useState("2");
  const [selectedRoomId, setSelectedRoomId] = useState(CIVITAS_ROOM_ID);
  const [searchQuery, setSearchQuery] = useState("");
  const [showListModal, setShowListModal] = useState(false);
  const [showMandatoriModal, setShowMandatoriModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [activeTabMode, setActiveTabMode] = useState("PDF"); // "PDF" | "MANDATORI"
  const [expandedTk, setExpandedTk] = useState({
    "TK-01": true,
    "TK-02": true,
    "TK-03": true,
  });
  const [tkSearchQuery, setTkSearchQuery] = useState({
    "TK-01": "",
    "TK-02": "",
    "TK-03": "",
  });

  // Helper to extract key search tokens from room / location strings
  const getTokens = (str) => {
    return str
      .toLowerCase()
      .replace(/\b(ruangan|ruang|lab|laboratorium|gedung|lantai|lt|\d+|pos|pintu|depan|samping|komunal)\b/g, "")
      .replace(/[^a-z0-9]/g, " ")
      .trim()
      .split(/\s+/)
      .filter((t) => t.length > 2);
  };

  // Auto-select floor & room from passed location state (e.g. from APAR list / detail)
  useEffect(() => {
    const targetLokasi = location.state?.lokasi;
    if (targetLokasi) {
      const locLower = targetLokasi.toLowerCase();
      let targetAreaKey = "2";
      if (locLower.includes("lantai 1") || locLower.includes("lt 1") || locLower.includes("lantai-1") || locLower.includes("lt. 1")) {
        targetAreaKey = "1";
      } else if (locLower.includes("lantai 2") || locLower.includes("lt 2") || locLower.includes("lantai-2") || locLower.includes("lt. 2")) {
        targetAreaKey = "2";
      } else if (locLower.includes("lantai 3") || locLower.includes("lt 3") || locLower.includes("lantai-3") || locLower.includes("lt. 3")) {
        targetAreaKey = "3";
      } else if (locLower.includes("gf")) {
        targetAreaKey = "GF";
      } else if (locLower.includes("parkir")) {
        targetAreaKey = "Parkiran";
      } else if (locLower.includes("dorm")) {
        targetAreaKey = "Dormitori";
      }

      setSelectedArea(targetAreaKey);
      const targetFloorName = FLOOR_MAPPING[targetAreaKey] || "Lantai 2";

      const floorPdfs = DENAH_PDF_LIST.filter((pdf) => pdf.floor === targetFloorName);
      if (floorPdfs.length > 0) {
        // First try direct substring match
        let bestMatch = floorPdfs.find(
          (pdf) =>
            locLower.includes(pdf.roomName.toLowerCase()) ||
            pdf.roomName.toLowerCase().includes(locLower)
        );

        // If no direct substring match, use key token overlap score (e.g. "Lab Otomasi Industri" -> "Ruangan Otomasi Industri")
        if (!bestMatch) {
          const targetTokens = getTokens(targetLokasi);
          let maxScore = 0;

          for (const pdf of floorPdfs) {
            const pdfTokens = getTokens(pdf.roomName);
            let score = 0;
            for (const tt of targetTokens) {
              if (pdfTokens.some((pt) => pt.includes(tt) || tt.includes(pt))) {
                score += 1;
              }
            }
            if (score > maxScore) {
              maxScore = score;
              bestMatch = pdf;
            }
          }
        }

        if (bestMatch) {
          setSelectedRoomId(bestMatch.id);
        } else {
          setSelectedRoomId(floorPdfs[0].id);
        }
      }
    }
  }, [location.state]);

  const areas = [
    { id: "GF", label: "Gedung GF" },
    { id: "1", label: "Lantai 1" },
    { id: "2", label: "Lantai 2 (Ruanganku)" },
    { id: "3", label: "Lantai 3" },
    { id: "Parkiran", label: "Parkiran" },
    { id: "Dormitori", label: "Dormitory" },
  ];

  const currentFloorName = FLOOR_MAPPING[selectedArea] || "Lantai 2";

  // PDFs filtered by selected floor
  const currentFloorPdfs = useMemo(() => {
    return DENAH_PDF_LIST.filter((pdf) => pdf.floor === currentFloorName);
  }, [currentFloorName]);

  // Selected PDF item
  const selectedPdf = useMemo(() => {
    if (selectedRoomId) {
      const found = DENAH_PDF_LIST.find((p) => p.id === selectedRoomId);
      if (found) return found;
    }
    return currentFloorPdfs.find((p) => p.id === CIVITAS_ROOM_ID) || currentFloorPdfs[0] || null;
  }, [selectedRoomId, currentFloorPdfs]);

  // Global search or category filter list for search modal
  const filteredPdfs = useMemo(() => {
    return DENAH_PDF_LIST.filter((pdf) => {
      const matchesSearch =
        pdf.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pdf.floor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pdf.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "Semua" || pdf.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categories = ["Semua", "Laboratorium", "Workshop", "Ruang Kelas", "UPT", "Ruangan", "Gudang"];

  return (
    <MobileContainer>
      <div className="flex flex-col h-full bg-[#f9fafb] relative pb-[70px]">
        <Header title="Denah & Rute Evakuasi" showBack={false} />

        {/* Top Controls: Mode Switcher, Floor Tabs & Room Selector */}
        <div className="p-3 bg-white border-b border-gray-200/80 shadow-xs flex flex-col gap-2.5 z-10 shrink-0">
          {/* Mode Switcher Tabs (PDF Denah vs Mandatori Titik Kumpul) */}
          <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl gap-1">
            <button
              onClick={() => setActiveTabMode("PDF")}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTabMode === "PDF"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> PDF Denah Ruangan
            </button>

            <button
              onClick={() => setActiveTabMode("MANDATORI")}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTabMode === "MANDATORI"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> Mandatori Titik Kumpul
            </button>
          </div>

          {activeTabMode === "PDF" ? (
            <>
              {/* Floor Selection Tabs */}
              <div className="flex items-center justify-between gap-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-blue-600" /> Area / Lantai
                </label>
                <button
                  onClick={() => setShowListModal(true)}
                  className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Search className="w-3.5 h-3.5" /> Cari PDF ({DENAH_PDF_LIST.length}) <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex overflow-x-auto gap-1.5 pb-0.5 no-scrollbar">
                {areas.map((area) => {
                  const isActive = selectedArea === area.id;
                  const floorName = FLOOR_MAPPING[area.id];
                  const count = DENAH_PDF_LIST.filter((p) => p.floor === floorName).length;
                  return (
                    <button
                      key={area.id}
                      onClick={() => {
                        setSelectedArea(area.id);
                        setSelectedRoomId("");
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 transition-all flex items-center gap-1.5 ${
                        isActive
                          ? "bg-[#0b5cff] text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <span>{area.label}</span>
                      {count > 0 && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                            isActive ? "bg-white/25 text-white" : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Room Selector Dropdown & Actions */}
              {currentFloorPdfs.length > 0 ? (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedPdf ? selectedPdf.id : ""}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
                  >
                    {currentFloorPdfs.map((pdf) => {
                      const isCivitasRoom = pdf.id === CIVITAS_ROOM_ID;
                      return (
                        <option key={pdf.id} value={pdf.id}>
                          {isCivitasRoom ? `📍 ${pdf.roomName} (Ruangan Saya)` : `${pdf.roomName} (${pdf.category})`}
                        </option>
                      );
                    })}
                  </select>

                  {selectedPdf && (
                    <>
                      <a
                        href={selectedPdf.path}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors shrink-0"
                        title="Buka di Tab Baru"
                      >
                        <ExternalLink size={16} />
                      </a>

                      <a
                        href={selectedPdf.path}
                        download={selectedPdf.fileName}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1 text-xs shadow-xs"
                        title="Unduh PDF Ruangan"
                      >
                        <Download size={15} /> Unduh
                      </a>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-xs text-gray-400 italic bg-gray-50 p-2 rounded-xl text-center border border-gray-100">
                  Belum ada berkas PDF denah untuk area {selectedArea}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-blue-600" /> Mandatori Area Tujuan Evakuasi
              </span>
              <p className="text-[11px] text-gray-600">
                Gedung &amp; lantai dialokasikan secara mandatori ke Titik Kumpul tertentu untuk akurasi perhitungan jumlah MP ter-evakuasi.
              </p>
            </div>
          )}
        </div>

        {/* Main Area View */}
        {activeTabMode === "PDF" ? (
          <div className="flex-1 bg-slate-900 relative overflow-hidden flex flex-col p-2">
            {selectedPdf ? (
              <div className="w-full h-full flex flex-col rounded-xl overflow-hidden shadow-lg border border-slate-800 bg-white relative">
                {/* Active PDF Subheader with Conditional Location Tag Marker */}
                <div className="bg-slate-800 text-white px-3 py-2 flex items-center justify-between text-xs border-b border-slate-700 shrink-0 gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="font-bold truncate">{selectedPdf.roomName}</span>
                    <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full shrink-0">
                      {selectedPdf.floor}
                    </span>
                  </div>

                  {/* Location Tag Marker Icon Badge */}
                  {location.state?.assetId ? (
                    <div className="flex items-center gap-1 bg-[#0b5cff] text-white px-2.5 py-1 rounded-full text-[10px] font-extrabold shrink-0 border border-blue-400/40 shadow-xs animate-pulse">
                      <MapPin className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                      <span>📍 LOKASI {location.state.assetId} AKTIF</span>
                    </div>
                  ) : selectedPdf.id === CIVITAS_ROOM_ID ? (
                    <div className="flex items-center gap-1 bg-green-600 text-white px-2.5 py-1 rounded-full text-[10px] font-extrabold shrink-0 border border-green-400/40 shadow-xs animate-pulse">
                      <MapPin className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                      <span>📍 LOKASI RUANGANKU AKTIF</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full text-[10px] font-semibold shrink-0">
                      <span>Ruangan Lain</span>
                    </div>
                  )}

                  <a
                    href={selectedPdf.path}
                    download={selectedPdf.fileName}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 shrink-0 ml-1"
                  >
                    <Download size={13} /> PDF
                  </a>
                </div>

                {/* Direct PDF Iframe Viewer */}
                <iframe
                  key={selectedPdf.path}
                  src={selectedPdf.path}
                  title={selectedPdf.roomName}
                  className="w-full flex-1 border-0 bg-white"
                />
              </div>
            ) : (
              <div className="w-full h-full rounded-2xl bg-white border border-gray-200 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                  <FolderOpen size={24} />
                </div>
                <h4 className="text-sm font-bold text-gray-700">Denah Belum Tersedia</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Belum ada file PDF denah yang diunggah untuk area ini. Silakan pilih lantai atau cari ruangan lainnya.
                </p>
                <button
                  onClick={() => setShowListModal(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:bg-blue-700"
                >
                  <Search size={14} /> Lihat Semua PDF Denah
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 bg-gray-100 p-3 overflow-y-auto custom-scrollbar flex flex-col gap-3">
            {/* 3 Assembly Point Cards with Search Bar and Actual Rooms from Denah */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 font-['Poppins',sans-serif]">
                  <MapPin className="w-4 h-4 text-blue-600" /> 3 Area Titik Kumpul & Alokasi Ruangan:
                </h4>
                <span className="text-[10px] text-gray-400 font-bold">
                  Total {DENAH_PDF_LIST.length} Ruangan Denah
                </span>
              </div>

              {MANDATORI_TITIK_KUMPUL.map((tk) => {
                const roomsInTk = DENAH_PDF_LIST.filter((pdf) =>
                  tk.targetFloors.includes(pdf.floor)
                );

                const currentSearch = (tkSearchQuery[tk.id] || "").toLowerCase();
                const filteredRooms = roomsInTk.filter(
                  (pdf) =>
                    pdf.roomName.toLowerCase().includes(currentSearch) ||
                    pdf.category.toLowerCase().includes(currentSearch) ||
                    pdf.floor.toLowerCase().includes(currentSearch)
                );

                const isExpanded = expandedTk[tk.id] !== false;

                return (
                  <div
                    key={tk.id}
                    className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden flex flex-col transition-all"
                  >
                    {/* Card Header */}
                    <div className="p-3.5 bg-gray-50/80 border-b border-gray-200/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full ${tk.warna} shrink-0 shadow-xs`} />
                        <h5 className="text-xs font-bold text-gray-900 font-['Poppins',sans-serif]">
                          {tk.nama}
                        </h5>
                      </div>
                      <span className="text-[10px] bg-green-100 text-green-800 font-extrabold px-2.5 py-0.5 rounded-full shrink-0 border border-green-200">
                        {tk.status}
                      </span>
                    </div>

                    {/* Card Body: Room Search Input & Rooms List */}
                    <div className="p-3.5 flex flex-col gap-2.5 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-blue-600" />
                          Daftar Ruangan ({filteredRooms.length} dari {roomsInTk.length})
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedTk((prev) => ({
                              ...prev,
                              [tk.id]: !isExpanded,
                            }))
                          }
                          className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          {isExpanded ? "Sembunyikan" : "Lihat Ruangan"}
                        </button>
                      </div>

                      {/* Card Search Input */}
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={tkSearchQuery[tk.id] || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTkSearchQuery((prev) => ({
                              ...prev,
                              [tk.id]: val,
                            }));
                          }}
                          placeholder={`Cari ruangan di ${tk.id}...`}
                          className="w-full pl-8 pr-7 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-['Poppins',sans-serif]"
                        />
                        {tkSearchQuery[tk.id] && (
                          <button
                            type="button"
                            onClick={() =>
                              setTkSearchQuery((prev) => ({
                                ...prev,
                                [tk.id]: "",
                              }))
                            }
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>

                      {/* Room Pills List */}
                      {isExpanded && (
                        <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto custom-scrollbar pt-1 pr-1">
                          {filteredRooms.length === 0 ? (
                            <div className="py-4 text-center text-xs text-gray-400 italic">
                              Tidak ada ruangan ditemukan untuk "{tkSearchQuery[tk.id]}"
                            </div>
                          ) : (
                            filteredRooms.map((pdf) => (
                              <button
                                key={pdf.id}
                                onClick={() => {
                                  setActiveTabMode("PDF");
                                  setSelectedArea(mapFloorToAreaId(pdf.floor));
                                  setSelectedRoomId(pdf.id);
                                }}
                                className="p-2 bg-gray-50 hover:bg-blue-50/80 border border-gray-100 hover:border-blue-200 rounded-xl text-left flex items-center justify-between transition-all group cursor-pointer"
                                title="Klik untuk melihat PDF Denah Ruangan ini"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
                                  <span className="text-xs font-bold text-gray-800 truncate font-['Poppins',sans-serif]">
                                    {pdf.roomName}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1 shrink-0 ml-2">
                                  <span className="text-[9px] bg-white text-gray-600 font-semibold px-2 py-0.5 rounded-md border border-gray-200">
                                    {pdf.category}
                                  </span>
                                  <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md">
                                    {pdf.floor}
                                  </span>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Browse & Search All PDFs */}
        {showListModal && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-3.5 bg-white border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Daftar Semua PDF Denah</h3>
                  <p className="text-[11px] text-gray-500">Total {DENAH_PDF_LIST.length} PDF denah ruangan</p>
                </div>
                <button
                  onClick={() => setShowListModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-3 bg-gray-50 border-b border-gray-200 flex flex-col gap-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari ruangan, lab, atau workshop..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="flex overflow-x-auto gap-1 pb-1 no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg shrink-0 transition-colors ${
                        selectedCategory === cat
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 custom-scrollbar">
                {filteredPdfs.length > 0 ? (
                  filteredPdfs.map((pdf) => (
                    <div
                      key={pdf.id}
                      className="p-2.5 bg-white border border-gray-200 hover:border-blue-300 rounded-xl flex items-center justify-between gap-3 shadow-xs hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                          <FileText size={18} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate">{pdf.roomName}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded">
                              {pdf.floor}
                            </span>
                            <span className="text-[10px] text-blue-600 font-medium">{pdf.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            // Find corresponding area key
                            const areaKey = Object.keys(FLOOR_MAPPING).find(
                              (k) => FLOOR_MAPPING[k] === pdf.floor
                            );
                            if (areaKey) setSelectedArea(areaKey);
                            setSelectedRoomId(pdf.id);
                            setShowListModal(false);
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 transition-colors shadow-xs"
                        >
                          Tampilkan PDF
                        </button>
                        <a
                          href={pdf.path}
                          download={pdf.fileName}
                          className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-[11px] transition-colors"
                          title="Unduh PDF"
                        >
                          <Download size={14} />
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-400 text-xs">
                    Tidak ada berkas PDF denah yang cocok dengan pencarian.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </MobileContainer>
  );
}