using System.ComponentModel.DataAnnotations;

namespace TanggapDaruratApi.DTOs.Laporan.Request
{
    public record CreateLaporanRequest
    {
        [Required(ErrorMessage = "Ringkasan laporan harus diisi.")]
        [StringLength(2000)]
        public string Ringkasan { get; init; } = string.Empty;

        [StringLength(1000)]
        public string? TindakLanjut { get; init; }
    }
}
