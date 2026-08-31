using System.ComponentModel.DataAnnotations;

namespace TanggapDaruratApi.DTOs.Pemadaman.Request
{
    public record UpsertPemadamanRequest
    {
        [StringLength(200)]
        public string? SumberApi { get; init; }

        public bool PerluDamkar { get; init; }

        [StringLength(500)]
        public string? HasilPemadaman { get; init; }
    }
}
