const isDev = typeof __DEV__ !== "undefined"
  ? Boolean(__DEV__)
  : (typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.DEV : true);

const getDevApiUrl = () => {
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // If accessed from phone via LAN IP (e.g. 192.168.x.x:5173), route to the same host on .NET port 52695
  if (typeof window !== "undefined" && window.location?.hostname) {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      return `http://${host}:52695/api/`;
    }
  }
  return "http://localhost:52695/api/";
};

const ENV = {
  dev: {
    API_URL: getDevApiUrl(),
  },
  prod: {
    API_URL: (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "https://api.tanggap-darurat.astratech.ac.id/api/",
  },
};

export const Config = isDev ? ENV.dev : ENV.prod;

