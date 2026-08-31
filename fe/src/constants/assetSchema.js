// Asset parameter specifications and OK/NOK status mappings according to HSE requirements

export const ASSET_TYPE_NAMES = {
  APAR: "APAR",
  HYDRANT_BOX: "Hydrant Box",
  POMPA_HYDRANT: "Pompa Hydrant",
  EMERGENCY_BOX: "Emergency Box",
  APD: "APD Box",
};

export const ASSET_SCHEMAS = {
  APAR: {
    name: "APAR",
    parameters: [
      {
        id: "keberadaan",
        label: "Keberadaan APAR",
        options: [
          { value: "Ada", status: "OK" },
          { value: "Tidak Ada (Hilang)", status: "NOK" },
          { value: "Berpindah Lokasi", status: "NOK" },
        ],
      },
      {
        id: "checksheet",
        label: "Checksheet",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Pudar", status: "NOK" },
          { value: "Sobek", status: "NOK" },
        ],
      },
      {
        id: "bracket",
        label: "Bracket (APAR posisi gantung)",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Longgar", status: "NOK" },
          { value: "Hilang", status: "NOK" },
          { value: "Patah", status: "NOK" },
        ],
      },
      {
        id: "stand",
        label: "Stand APAR",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Hilang", status: "NOK" },
        ],
      },
      {
        id: "tabung",
        label: "Kondisi Tabung",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Lecet", status: "NOK" },
          { value: "Penyok", status: "NOK" },
          { value: "Korosi Ringan", status: "OK" },
          { value: "Korosi Berat", status: "NOK" },
          { value: "Bocor", status: "NOK" },
        ],
      },
      {
        id: "handle",
        label: "Handle/Pegangan/Tuas",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Longgar", status: "OK" },
          { value: "Bengkok", status: "NOK" },
          { value: "Patah", status: "NOK" },
        ],
      },
      {
        id: "pin",
        label: "Safety Pin",
        options: [
          { value: "Terpasang", status: "OK" },
          { value: "Longgar", status: "OK" },
          { value: "Hilang", status: "NOK" },
        ],
      },
      {
        id: "kebersihan",
        label: "Kebersihan",
        options: [
          { value: "Bersih", status: "OK" },
          { value: "Berdebu", status: "OK" },
          { value: "Terkena Minyak/Oli", status: "NOK" },
        ],
      },
    ],
    subtypes: {
      POWDER: [
        {
          id: "pressure",
          label: "Pressure",
          options: [
            { value: "Normal", status: "OK" },
            { value: "Perlu Refill", status: "NOK" },
          ],
        },
        {
          id: "kondisiPowder",
          label: "Kondisi Powder",
          options: [
            { value: "Normal", status: "OK" },
            { value: "Menggumpal", status: "NOK" },
          ],
        },
      ],
      CO2: [
        {
          id: "beratTabung",
          label: "Berat Tabung",
          options: [
            { value: "Normal", status: "OK" },
            { value: "Berkurang", status: "NOK" },
            { value: "Tidak Ditimbang", status: "NOK" },
          ],
        },
        {
          id: "corong",
          label: "Corong",
          options: [
            { value: "Normal", status: "OK" },
            { value: "Tersumbat", status: "NOK" },
            { value: "Kotor", status: "NOK" },
          ],
        },
      ],
    },
    overallConditionOptions: ["Siap Digunakan", "Tidak Layak Digunakan"],
  },

  HYDRANT_BOX: {
    name: "Hydrant Box",
    parameters: [
      {
        id: "kondisiBox",
        label: "Kondisi Hydrant Box",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Penyok", status: "NOK" },
          { value: "Korosi Ringan", status: "OK" },
          { value: "Korosi Berat", status: "NOK" },
          { value: "Berlubang", status: "NOK" },
        ],
      },
      {
        id: "checksheet",
        label: "Checksheet",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Pudar", status: "NOK" },
          { value: "Sobek", status: "NOK" },
        ],
      },
      {
        id: "pintuBox",
        label: "Pintu Box",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Macet", status: "NOK" },
          { value: "Bengkok", status: "NOK" },
        ],
      },
      {
        id: "engsel",
        label: "Engsel",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Penyok", status: "NOK" },
        ],
      },
      {
        id: "kunci",
        label: "Kunci/Latch",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Korosi Ringan", status: "OK" },
          { value: "Korosi Berat", status: "NOK" },
          { value: "Penyok", status: "NOK" },
        ],
      },
      {
        id: "kebersihan",
        label: "Kebersihan",
        options: [
          { value: "Bersih", status: "OK" },
          { value: "Berdebu", status: "NOK" },
          { value: "Ada Sampah", status: "NOK" },
        ],
      },
      {
        id: "selang",
        label: "Selang Hydrant",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Berjamur", status: "NOK" },
          { value: "Kaku", status: "NOK" },
          { value: "Getas", status: "NOK" },
          { value: "Sobek", status: "NOK" },
          { value: "Bocor", status: "NOK" },
          { value: "Tidak Tergulung Rapih", status: "NOK" },
          { value: "Hilang", status: "NOK" },
        ],
      },
      {
        id: "coupling",
        label: "Coupling",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Korosi Ringan", status: "OK" },
          { value: "Korosi Berat", status: "NOK" },
        ],
      },
    ],
    overallConditionOptions: ["Siap Digunakan", "Tidak Siap Digunakan"],
  },

  POMPA_HYDRANT: {
    name: "Pompa Hydrant",
    parameters: [
      {
        id: "kondisiPompa",
        label: "Kondisi Pompa",
        options: [
          { value: "Normal", status: "OK" },
          { value: "Rusak", status: "NOK" },
        ],
      },
      {
        id: "checksheet",
        label: "Checksheet",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Pudar", status: "NOK" },
          { value: "Sobek", status: "NOK" },
        ],
      },
      {
        id: "modePanel",
        label: "Mode Panel",
        options: [
          { value: "Auto", status: "OK" },
          { value: "Manual", status: "OK" },
          { value: "Off", status: "NOK" },
        ],
      },
      {
        id: "powerSupply",
        label: "Power Supply",
        options: [
          { value: "Normal", status: "OK" },
          { value: "Gangguan", status: "NOK" },
          { value: "Mati", status: "NOK" },
        ],
      },
      {
        id: "indikatorPanel",
        label: "Indikator Panel",
        options: [
          { value: "Normal", status: "OK" },
          { value: "Fault", status: "NOK" },
          { value: "Alarm", status: "NOK" },
        ],
      },
      {
        id: "kebocoran",
        label: "Kebocoran",
        options: [
          { value: "Nomal", status: "OK" },
          { value: "Bocor", status: "NOK" },
        ],
      },
      {
        id: "suaraPompa",
        label: "Suara Pompa",
        options: [
          { value: "Normal", status: "OK" },
          { value: "Berisik", status: "NOK" },
          { value: "Getaran Tinggi", status: "NOK" },
        ],
      },
      {
        id: "startOtomatis",
        label: "Start Otomatis",
        options: [
          { value: "Normal", status: "OK" },
          { value: "Delay", status: "NOK" },
          { value: "Tidak Beroperasi", status: "NOK" },
        ],
      },
      {
        id: "stop",
        label: "Stop",
        options: [
          { value: "Normal", status: "OK" },
          { value: "Tidak Normal", status: "NOK" },
        ],
      },
      {
        id: "tekanan",
        label: "Tekanan",
        options: [
          { value: "Normal", status: "OK" },
          { value: "Rendah", status: "NOK" },
          { value: "Tinggi", status: "NOK" },
          { value: "Fluktuatif", status: "NOK" },
        ],
      },
      {
        id: "pipa",
        label: "Pipa",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Bocor", status: "NOK" },
          { value: "Korosi Ringan", status: "OK" },
          { value: "Korosi Berat", status: "NOK" },
        ],
      },
    ],
    overallConditionOptions: ["Siap Digunakan", "Tidak Siap Digunakan"],
  },

  EMERGENCY_BOX: {
    name: "Emergency Box",
    parameters: [
      {
        id: "keberadaan",
        label: "Keberadaan Emergency Box",
        jumlah: "-",
        options: [
          { value: "Ada", status: "OK" },
          { value: "Tidak Ada", status: "NOK" },
        ],
      },
      {
        id: "checksheet",
        label: "Checksheet",
        jumlah: "-",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Pudar", status: "NOK" },
          { value: "Sobek", status: "NOK" },
        ],
      },
      {
        id: "kondisiBox",
        label: "Kondisi Box",
        jumlah: "-",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Penyok Ringan", status: "OK" },
          { value: "Penyok Berat", status: "NOK" },
          { value: "Korosi Ringan", status: "OK" },
          { value: "Korosi Berat", status: "NOK" },
        ],
      },
      {
        id: "pintu",
        label: "Pintu",
        jumlah: "-",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Macet", status: "NOK" },
          { value: "Bengkok", status: "NOK" },
        ],
      },
      {
        id: "helmWarden",
        label: "Helm Safety Tim Floor Warden",
        jumlah: "2",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Rusak", status: "NOK" },
          { value: "Hilang", status: "NOK" },
        ],
      },
      {
        id: "helmP3K",
        label: "Helm Safety Tim P3K",
        jumlah: "2",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Rusak", status: "NOK" },
          { value: "Hilang", status: "NOK" },
        ],
      },
      {
        id: "rompiWarden",
        label: "Rompi Safety Floor Warden",
        jumlah: "2",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Rusak", status: "NOK" },
          { value: "Hilang", status: "NOK" },
        ],
      },
      {
        id: "rompiP3K",
        label: "Rompi Safety Tim P3K",
        jumlah: "2",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Rusak", status: "NOK" },
          { value: "Hilang", status: "NOK" },
        ],
      },
      {
        id: "sarungTangan",
        label: "Sarung Tangan Safety",
        jumlah: "4",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Rusak", status: "NOK" },
          { value: "Hilang", status: "NOK" },
        ],
      },
      {
        id: "kacamata",
        label: "Kacamata Safety",
        jumlah: "4",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Rusak", status: "NOK" },
          { value: "Hilang", status: "NOK" },
        ],
      },
      {
        id: "masker",
        label: "Masker Safety",
        jumlah: "4",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Rusak", status: "NOK" },
          { value: "Hilang", status: "NOK" },
        ],
      },
      {
        id: "senter",
        label: "Senter Emergency",
        jumlah: "1",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Rusak", status: "NOK" },
          { value: "Hilang", status: "NOK" },
        ],
      },
      {
        id: "baterai",
        label: "Batterai Senter",
        jumlah: "1",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Rusak", status: "NOK" },
          { value: "Hilang", status: "NOK" },
        ],
      },
      {
        id: "peluit",
        label: "Peluit/Toa",
        jumlah: "1",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Rusak", status: "NOK" },
          { value: "Hilang", status: "NOK" },
        ],
      },
      {
        id: "p3k",
        label: "P3K",
        jumlah: "1",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Rusak", status: "NOK" },
          { value: "Hilang", status: "NOK" },
        ],
      },
      {
        id: "tandu",
        label: "Tandu",
        jumlah: "1",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Rusak", status: "NOK" },
          { value: "Hilang", status: "NOK" },
        ],
      },
    ],
    overallConditionOptions: ["Siap Digunakan", "Tidak Siap Digunakan"],
  },

  APD: {
    name: "APD Box",
    parameters: [
      {
        id: "keberadaan",
        label: "Keberadaan APD Box",
        jumlah: "-",
        options: [
          { value: "Ada", status: "OK" },
          { value: "Tidak Ada", status: "NOK" },
        ],
      },
      {
        id: "kondisiBox",
        label: "Kondisi Box",
        jumlah: "-",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Penyok Ringan", status: "OK" },
          { value: "Penyok Berat", status: "NOK" },
          { value: "Korosi Ringan", status: "OK" },
          { value: "Korosi Berat", status: "NOK" },
        ],
      },
      {
        id: "checksheet",
        label: "Checksheet",
        jumlah: "-",
        options: [
          { value: "Baik", status: "OK" },
          { value: "Pudar", status: "NOK" },
          { value: "Sobek", status: "NOK" },
        ],
      },
      {
        id: "apdAtasan",
        label: "APD Atasan (Baju)",
        jumlah: "8",
        options: [
          { value: "Ada", status: "OK" },
          { value: "Sobek", status: "NOK" },
          { value: "Hilang", status: "NOK" },
        ],
      },
      {
        id: "apdBawahan",
        label: "APD Bawahan (Celana)",
        jumlah: "8",
        options: [
          { value: "Ada", status: "OK" },
          { value: "Sobek", status: "NOK" },
          { value: "Hilang", status: "NOK" },
        ],
      },
      {
        id: "sepatuSafety",
        label: "Sepatu Safety",
        jumlah: "8",
        options: [
          { value: "Ada", status: "OK" },
          { value: "Rusak", status: "NOK" },
          { value: "Hilang", status: "NOK" },
        ],
      },
      {
        id: "helmSafety",
        label: "Helm Safety",
        jumlah: "8",
        options: [
          { value: "Ada", status: "OK" },
          { value: "Rusak", status: "NOK" },
          { value: "Hilang", status: "NOK" },
        ],
      },
    ],
    overallConditionOptions: ["Siap Digunakan", "Tidak Siap Digunakan"],
  },
};
