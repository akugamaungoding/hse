const ENV = {
  dev: {
    API_URL: "https://localhost:52694/api/",
  },
  prod: {
    API_URL: "https://api.tanggap-darurat.astratech.ac.id/api/",
  },
};

export const Config = import.meta.env.DEV ? ENV.dev : ENV.prod;
