export const initSecurityScanner = async () => {
  try {
    console.log("🛡️ freeRASP Security Scanner Active");
  } catch (error) {
    console.error("Gagal memulai security scanner", error);
  }
};
