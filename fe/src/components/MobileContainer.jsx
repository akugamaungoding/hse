import { useEffect, useState } from "react";

export function MobileContainer({ children }) {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="w-full h-screen bg-white relative overflow-hidden flex flex-col font-['Poppins',sans-serif]">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-['Poppins',sans-serif] overflow-hidden">
      <div
        style={{
          width: "430px",
          height: "932px",
        }}
        className="bg-white relative shadow-2xl rounded-[40px] border-[8px] border-gray-900 overflow-hidden flex-shrink-0"
      >
        {children}
      </div>
    </div>
  );
}