using System;

namespace TanggapDaruratApi.DTOs.Simulasi
{
    public class SimulasiRequest
    {
        public string Nama { get; set; } = string.Empty;
        public DateTime Tanggal { get; set; }
        public string? Deskripsi { get; set; }
        public int PesertaCount { get; set; }
        public string? Evaluasi { get; set; }
    }
}
