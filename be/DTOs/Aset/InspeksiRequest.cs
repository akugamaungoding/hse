namespace TanggapDaruratApi.DTOs.Aset
{
    public class InspeksiRequest
    {
        public string Status { get; set; } = "Aman";
        public string? Catatan { get; set; }
        public string? FotoUrl { get; set; }
        public string? FotoBeforeUrl { get; set; }
        public string? FotoAfterUrl { get; set; }
        public string? FormData { get; set; } 
    }
}
