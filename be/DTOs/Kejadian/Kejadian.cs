namespace TanggapDaruratApi.DTOs.Kejadian
{
    public class Kejadian
    {
        public int KejadianId { get; set; }
        public string KodeKejadian { get; set; } = string.Empty;
        public string JenisKejadian { get; set; } = string.Empty;
        public string Lokasi { get; set; } = string.Empty;
        public string? Deskripsi { get; set; }
        public string? FotoUrl { get; set; }
        public string Status { get; set; } = string.Empty;

        public int DilaporkanOlehUserId { get; set; }
        public string? DilaporkanOlehNama { get; set; }
        public DateTime WaktuLapor { get; set; }

        public int? DivalidasiOlehUserId { get; set; }
        public string? DivalidasiOlehNama { get; set; }
        public DateTime? WaktuValidasi { get; set; }
        public bool? HasilValidasi { get; set; }
        public string? CatatanValidasi { get; set; }

        public DateTime? WaktuPengumumanDarurat { get; set; }
        public DateTime? WaktuPengumumanAman { get; set; }
        public DateTime? WaktuDitetapkanAman { get; set; }
    }
}
