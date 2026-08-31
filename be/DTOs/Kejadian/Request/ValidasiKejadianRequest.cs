using System.ComponentModel.DataAnnotations;

namespace TanggapDaruratApi.DTOs.Kejadian.Request
{
    public record ValidasiKejadianRequest
    {
        [Required(ErrorMessage = "Hasil validasi harus diisi.")]
        public bool HasilValidasi { get; init; }

        [StringLength(500)]
        public string? Catatan { get; init; }
    }
}
