using System;

namespace TanggapDaruratApi.DTOs.Aset
{
    public class UpdateAsetDto
    {
        public string? Tipe { get; set; }
        public string Lokasi { get; set; } = string.Empty;
        public string? Detail { get; set; }
        public DateTime? ExpiredDate { get; set; }
        public string Status { get; set; } = "Aman";
    }
}
