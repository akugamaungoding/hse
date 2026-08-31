import { useEffect } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../components/MobileContainer";
import { useAuthStore } from "@/store/useAuthStore";
import { ROLE_HOME } from "@/constants/routes";
import { Shield } from "lucide-react";
export function Splash() {
  const navigate = useNavigate();
  const { isAuthenticated, roleCode } = useAuthStore();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(isAuthenticated ? ROLE_HOME[roleCode] || "/utama" : "/login");
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated, roleCode]);
  return <MobileContainer>
    <div className="flex flex-col items-center justify-center h-full bg-[#0140c7] relative overflow-hidden">
      { }      <div className="absolute w-[400px] h-[400px] rounded-full bg-white/5 top-[-100px] right-[-100px]" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-white/5 bottom-[-80px] left-[-80px]" />

      <div className="flex flex-col items-center gap-6 z-10">
        { }        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
          <Shield className="w-12 h-12 text-[#0140c7]" />
        </div>

        { }        <div className="text-center">
          <h1 className="text-white font-['Poppins',sans-serif] text-4xl font-extrabold tracking-tight">
            HSE<span className="text-blue-200"> Mobile</span>
          </h1>
          <p className="text-blue-200 text-sm font-medium mt-1 font-['Poppins',sans-serif]">
            Safety · Health · Environment
          </p>
        </div>

        { }        <div className="flex flex-col items-center gap-1 mt-4">
          <div className="w-12 h-[1px] bg-blue-400" />
          <p className="text-blue-100 text-xs font-medium font-['Poppins',sans-serif] px-4 text-center mt-2">
            Politeknik Astra
          </p>
        </div>
      </div>

      { }      <div className="absolute bottom-16 flex gap-2">
        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{
          animationDelay: "0ms"
        }} />
        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{
          animationDelay: "150ms"
        }} />
        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{
          animationDelay: "300ms"
        }} />
      </div>
    </div>
  </MobileContainer>;
}