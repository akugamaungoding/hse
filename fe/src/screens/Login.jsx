import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../components/MobileContainer";
import { Shield, Eye, EyeOff, User, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_HOME } from "@/constants/routes";

export function Login() {
  const navigate = useNavigate();
  const { loginAction, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Nama pengguna dan kata sandi wajib diisi.");
      return;
    }

    const res = await loginAction(username, password);
    if (!res.success) {
      setError(res.message || "Login gagal.");
      return;
    }

    navigate(ROLE_HOME[res.roleCode] || "/utama");
  };

  return (
    <MobileContainer>
      <div className="flex flex-col h-full bg-[#f0f4ff]">
        { }        <div className="bg-[#0140c7] pt-14 pb-10 px-6 flex flex-col items-center relative overflow-hidden">
          <div className="absolute w-48 h-48 rounded-full bg-white/10 -top-10 -right-10" />
          <div className="absolute w-32 h-32 rounded-full bg-white/10 bottom-0 left-0" />
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4 z-10">
            <Shield className="w-8 h-8 text-[#0140c7]" />
          </div>
          <h1 className="text-white font-['Poppins',sans-serif] text-2xl font-extrabold z-10">SHE Mobile</h1>
          <p className="text-blue-200 text-xs font-medium mt-1 font-['Poppins',sans-serif] z-10">
            Politeknik Astra
          </p>
        </div>

        { }        <div className="flex-1 px-6 -mt-6 z-10">
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-['Poppins',sans-serif] font-bold text-xl text-gray-800 mb-1">Selamat Datang</h2>
            <p className="text-xs text-gray-500 mb-6">Masuk untuk melanjutkan ke aplikasi</p>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              { }              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 font-['Poppins',sans-serif]">
                  Nama Pengguna
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 px-3 h-12 gap-2 focus-within:border-[#0140c7] transition-colors">
                  <User className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Masukkan nama pengguna"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 font-['Poppins',sans-serif]"
                  />
                </div>
              </div>

              { }              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 font-['Poppins',sans-serif]">
                  Kata Sandi
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 px-3 h-12 gap-2 focus-within:border-[#0140c7] transition-colors">
                  <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 font-['Poppins',sans-serif]"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-xs text-red-500 font-medium font-['Poppins',sans-serif]">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-[#0140c7] text-white rounded-xl h-12 font-bold font-['Poppins',sans-serif] shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 py-6 font-['Poppins',sans-serif]">
          © 2026 SHE Division · Politeknik Astra
        </p>
      </div>
    </MobileContainer>
  );
}
