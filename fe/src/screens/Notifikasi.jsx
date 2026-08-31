import { useEffect, useState } from "react";
import { MobileContainer } from "../components/MobileContainer";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import { AlertCircle, Calendar, CheckCircle2, Info, Bell, Siren, ShieldCheck, ChevronLeft } from "lucide-react";
import { notifikasiServices } from "@/services/notifikasiServices";



function iconForTipe(tipe) {
  switch (tipe) {
    case "Bahaya":
      return {
        icon: <Siren className="text-red-500" size={20} />,
        bg: "bg-red-50",
      };
    case "Aman":
      return {
        icon: <ShieldCheck className="text-green-500" size={20} />,
        bg: "bg-green-50",
      };
    default:
      return {
        icon: <Bell className="text-blue-500" size={20} />,
        bg: "bg-blue-50",
      };
  }
}

function formatRelativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit yang lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam yang lalu`;
  return `${Math.floor(hours / 24)} hari yang lalu`;
}

export function Notifikasi() {
  const [serverNotifs, setServerNotifs] = useState([]);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let localItems = [];
    try {
      const saved = JSON.parse(localStorage.getItem("LOCAL_NOTIFIKASI_LIST") || "[]");
      localItems = saved.map((n) => ({
        id: n.id,
        title: n.title,
        desc: n.desc,
        time: n.time || formatRelativeTime(n.createdAt),
        icon: <Bell className="text-blue-600" size={20} />,
        bg: "bg-blue-50",
        isUnread: n.isUnread !== false,
      }));
    } catch (e) {}

    notifikasiServices
      .getAll({ pageSize: 20 })
      .then((res) => {
        const mapped = (res.data || []).map((n) => {
          const { icon, bg } = iconForTipe(n.tipe);
          return {
            id: `srv-${n.notifikasiId}`,
            title: n.judul,
            desc: n.pesan,
            time: formatRelativeTime(n.createdAt),
            icon,
            bg,
            isUnread: !n.isRead,
          };
        });
        setServerNotifs([...localItems, ...mapped]);
      })
      .catch(() => {
        setServerNotifs(localItems);
      });
  }, []);

  const handleNotifClick = async (notif) => {
    setSelectedNotif(notif);
    if (notif.isUnread) {
      setServerNotifs((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isUnread: false } : n))
      );

      if (notif.id.startsWith("srv-")) {
        const dbId = notif.id.replace("srv-", "");
        try {
          await notifikasiServices.markAsRead(dbId);
        } catch (err) {
          console.error("Gagal menandai notifikasi sebagai dibaca:", err);
        }
      }
    }
  };

  const allNotifs = [...serverNotifs];

  const sortedNotifs = [...allNotifs].sort((a, b) => {
    if (a.isUnread && !b.isUnread) return -1;
    if (!a.isUnread && b.isUnread) return 1;
    return 0;
  });

  const filteredNotifs = sortedNotifs.filter((n) => {
    if (filter === "unread") return n.isUnread;
    if (filter === "read") return !n.isUnread;
    return true;
  });

  const unreadCount = allNotifs.filter((n) => n.isUnread).length;

  if (selectedNotif) {
    return (
      <MobileContainer>
        <div className="flex flex-col h-full bg-[#f9fafb]">
          { }          <div className="flex items-center px-4 h-[60px] bg-[#0140c7] text-white sticky top-0 z-20 shrink-0">
            <button onClick={() => setSelectedNotif(null)} className="p-2 -ml-2 text-white">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="ml-2 font-['Poppins',sans-serif] font-bold text-lg">Detail Notifikasi</h1>
          </div>

          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-lg flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#0140c7]" />
              <div className={`p-4 rounded-2xl ${selectedNotif.bg} mb-4 shrink-0`}>
                {selectedNotif.icon}
              </div>
              <h2 className="font-['Poppins',sans-serif] font-bold text-gray-800 text-base leading-snug mb-2">
                {selectedNotif.title}
              </h2>
              <span className="text-[10px] text-gray-400 font-semibold mb-4 bg-gray-50 px-2.5 py-1 rounded-full">
                {selectedNotif.time}
              </span>
              <div className="w-full h-[1px] bg-gray-100 mb-4" />
              <p className="text-sm text-gray-600 leading-relaxed font-['Poppins',sans-serif] text-left w-full">
                {selectedNotif.desc}
              </p>
            </div>
          </div>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <div className="flex flex-col h-full bg-[#f0f4ff] relative pb-[72px]">
        <Header title="Notifikasi" showBack={false} />

        { }        <div className="flex gap-2 px-4 py-3 bg-white border-b border-gray-100 sticky top-[60px] z-10">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-['Poppins',sans-serif] transition-colors ${filter === "all"
              ? "bg-[#0140c7] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-['Poppins',sans-serif] transition-colors ${filter === "unread"
              ? "bg-[#0140c7] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            Belum Dibaca
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-['Poppins',sans-serif] transition-colors ${filter === "read"
              ? "bg-[#0140c7] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            Telah Dibaca
          </button>
        </div>

        {unreadCount > 0 && filter === "all" && (
          <div className="mx-4 mt-3 bg-[#0140c7]/10 border border-[#0140c7]/20 rounded-xl px-4 py-2 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#0140c7] shrink-0" />
            <p className="text-xs text-[#0140c7] font-semibold font-['Poppins',sans-serif]">
              {unreadCount} notifikasi belum dibaca
            </p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {filteredNotifs.length > 0 ? (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotifClick(notif)}
                className={`p-4 rounded-xl border bg-white flex items-start gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${notif.isUnread ? "border-[#0140c7]/30 shadow-sm" : "border-gray-100"
                  }`}
              >
                <div className={`p-2 rounded-xl ${notif.bg} shrink-0`}>
                  {notif.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h3
                      className={`text-sm font-semibold font-['Poppins',sans-serif] leading-tight ${notif.isUnread ? "text-gray-900" : "text-gray-500"
                        }`}
                    >
                      {notif.title}
                    </h3>
                    {notif.isUnread && <div className="w-2 h-2 rounded-full bg-[#0140c7] mt-1 shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500 mb-1.5 leading-relaxed truncate">{notif.desc}</p>
                  <span className="text-[10px] text-gray-400 font-medium">{notif.time}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-sm text-gray-400 font-['Poppins',sans-serif]">Tidak ada notifikasi.</p>
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </MobileContainer>
  );
}
