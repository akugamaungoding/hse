using System.ComponentModel.DataAnnotations;

namespace TanggapDaruratApi.DTOs.P3K.Request
{
    public record UpsertP3KRequest
    {
        [Required(ErrorMessage = "Status ada korban harus diisi.")]
        public bool AdaKorban { get; init; }

        public int? JumlahKorban { get; init; }

        [StringLength(300)]
        public string? KondisiKorban { get; init; }

        [StringLength(500)]
        public string? Tindakan { get; init; }

        public bool PerluAmbulans { get; init; }
    }
}
