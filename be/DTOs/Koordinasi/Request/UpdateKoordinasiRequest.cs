using System.ComponentModel.DataAnnotations;

namespace TanggapDaruratApi.DTOs.Koordinasi.Request
{
    public record UpdateKoordinasiRequest
    {
        [Required(ErrorMessage = "Catatan update harus diisi.")]
        [StringLength(500)]
        public string Catatan { get; init; } = string.Empty;
    }
}
