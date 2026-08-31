using System;

namespace TanggapDaruratApi.DTOs.Aset
{
    public class AsetDto
    {
        public string AssetId { get; set; } = string.Empty;
        public string Tipe { get; set; } = string.Empty;
        public string Lokasi { get; set; } = string.Empty;
        public string? Detail { get; set; }
        public DateTime? ExpiredDate { get; set; }
        public string Status { get; set; } = "Aman";
        public DateTime? LastInspeksi { get; set; }
    }
}
