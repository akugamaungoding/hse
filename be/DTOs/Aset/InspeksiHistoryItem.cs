using System;

namespace TanggapDaruratApi.DTOs.Aset
{
    public class InspeksiHistoryItem
    {
        public int InspeksiId { get; set; }
        public string AssetId { get; set; } = string.Empty;
        public DateTime Tanggal { get; set; }
        public string Petugas { get; set; } = string.Empty;
        public string Status { get; set; } = "Aman";
        public string? Catatan { get; set; }
        public string? FotoUrl { get; set; }
        public string? FotoBeforeUrl { get; set; }
        public string? FotoAfterUrl { get; set; }
        public string? FormData { get; set; }
    }
}
