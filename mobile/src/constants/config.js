const ENV = {
  dev: {
    API_URL: "http://10.15.0.2:8080/api/",
  },
  prod: {
    API_URL: "https://api.tanggap-darurat.astratech.ac.id/api/",
  },
};

export const Config = __DEV__ ? ENV.dev : ENV.prod;
