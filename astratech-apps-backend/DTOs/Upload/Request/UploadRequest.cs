using System.ComponentModel.DataAnnotations;

namespace astratech_apps_backend.DTOs.Upload.Request
{
    public record UploadRequest
    {
        [Required(ErrorMessage = "Berkas tidak boleh kosong.")]
        public required IFormFile File { get; init; }

        public string Modul { get; init; } = "General";
    }
}
