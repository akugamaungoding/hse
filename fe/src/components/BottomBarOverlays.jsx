import { Link } from "react-router";
export function BottomBarOverlays() {
  return <div className="absolute bottom-0 left-0 w-full h-[95px] z-50 flex">
      <Link to="/utama" className="flex-1 h-full" aria-label="Utama" />
      <Link to="/denah" className="flex-1 h-full" aria-label="Denah" />
      <Link to="/notifikasi" className="flex-1 h-full" aria-label="Notifikasi" />
      <Link to="/profil" className="flex-1 h-full" aria-label="Profil" />
    </div>;
}