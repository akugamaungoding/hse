import { useEffect, useState, useCallback } from "react";
import { kejadianServices } from "@/services/kejadianServices";

export function useActiveKejadian(intervalMs = 8000) {
  const [kejadian, setKejadian] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await kejadianServices.getAktif();
      setKejadian(data || null);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, intervalMs);
    return () => clearInterval(id);
  }, [refresh, intervalMs]);

  return { kejadian, loading, refresh };
}
