using System.ComponentModel.DataAnnotations;

namespace TanggapDaruratApi.DTOs.Kejadian.Request
{
    public record CreateKejadianRequest
    {
        [Required(ErrorMessage = "Jenis kejadian harus diisi.")]
        [StringLength(50)]
        public string JenisKejadian { get; init; } = string.Empty;

        [Required(ErrorMessage = "Lokasi kejadian harus diisi.")]
        [StringLength(200)]
        public string Lokasi { get; init; } = string.Empty;

        [StringLength(1000)]
        public string? Deskripsi { get; init; }

        public string? FotoUrl { get; init; }
    }
}
