import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
export function Header({
  title,
  showBack = true
}) {
  const navigate = useNavigate();
  return <div style={{ paddingTop: "env(safe-area-inset-top, 0px)", height: "calc(60px + env(safe-area-inset-top, 0px))" }} className="flex items-center px-4 bg-[#0140c7] text-white sticky top-0 z-20 shrink-0">
      {showBack && (
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      <h1 className={`${showBack ? "ml-2" : "ml-0"} font-['Poppins',sans-serif] font-bold text-lg`}>{title}</h1>
    </div>;
}