using System.ComponentModel.DataAnnotations;

namespace TanggapDaruratApi.DTOs.Evakuasi.Request
{
    public record SelesaiEvakuasiRequest
    {
        [StringLength(300)]
        public string? Catatan { get; init; }
    }
}
