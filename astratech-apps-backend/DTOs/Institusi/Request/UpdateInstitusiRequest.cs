using System.ComponentModel.DataAnnotations;

namespace astratech_apps_backend.DTOs.Institusi.Request
{
    public record UpdateInstitusiRequest : CreateInstitusiRequest
    {
        [Required(ErrorMessage = "ID institusi harus diisi.")]
        [Range(1, short.MaxValue, ErrorMessage = "ID institusi tidak valid.")]
        public required short Id { get; init; }
    }
}
