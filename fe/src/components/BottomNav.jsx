import { Link, useLocation } from "react-router";
import { Home, Map as MapIcon, Bell, User } from "lucide-react";
import { useApp } from "../context/AppContext";
export function BottomNav() {
  const location = useLocation();
  const path = location.pathname;
  const {
    notifUnreadCount
  } = useApp();
  const tabs = [{
    to: "/utama",
    icon: Home,
    label: "Utama",
    badge: 0
  }, {
    to: "/denah",
    icon: MapIcon,
    label: "Denah",
    badge: 0
  }, {
    to: "/notifikasi",
    icon: Bell,
    label: "Notifikasi",
    badge: notifUnreadCount
  }, {
    to: "/profil",
    icon: User,
    label: "Profil",
    badge: 0
  }];
  return <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-[72px] pb-2 pt-2 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {tabs.map(tab => {
      const isActive = path === tab.to;
      const Icon = tab.icon;
      return <Link key={tab.to} to={tab.to} className={`flex flex-col items-center gap-1 relative px-3 transition-colors ${isActive ? "text-[#0140c7]" : "text-gray-400"}`}>
            <div className="relative">
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              {tab.badge > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                  {tab.badge}
                </span>}
            </div>
            <span className="text-[10px] font-medium font-['Poppins',sans-serif]">{tab.label}</span>
          </Link>;
    })}
    </div>;
}