using System.ComponentModel.DataAnnotations;

namespace TanggapDaruratApi.DTOs.AssemblyPoint.Request
{
    public record ScanAssemblyRequest
    {
        [Required(ErrorMessage = "Kejadian harus diisi.")]
        public int KejadianId { get; init; }

        public string? KodeAssemblyPoint { get; init; }
    }
}
