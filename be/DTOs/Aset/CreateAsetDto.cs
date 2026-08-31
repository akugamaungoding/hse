using System;

namespace TanggapDaruratApi.DTOs.Aset
{
    public class CreateAsetDto
    {
        public string AssetId { get; set; } = string.Empty;
        public string Tipe { get; set; } = "APAR"; // APAR, HYDRANT_BOX, POMPA_HYDRANT, EMERGENCY_BOX, APD
        public string Lokasi { get; set; } = string.Empty;
        public string? Detail { get; set; }
        public DateTime? ExpiredDate { get; set; }
        public string Status { get; set; } = "Aman";
    }
}
