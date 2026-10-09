const ENV = {
  dev: {
    API_URL: "http://10.15.0.2:5234/api/",
  },
  prod: {
    API_URL: "https://api.perusahaan.com",
  },
};

export const Config = __DEV__ ? ENV.dev : ENV.prod;
