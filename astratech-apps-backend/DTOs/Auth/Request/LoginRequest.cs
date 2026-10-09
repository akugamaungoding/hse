using System.ComponentModel.DataAnnotations;

namespace astratech_apps_backend.DTOs.Auth.Request
{
    public record LoginRequest
    {
        [Required(ErrorMessage = "Nama akun harus diisi.")]
        [StringLength(50)]
        public string Username { get; init; } = string.Empty;

        [Required(ErrorMessage = "Kata sandi harus diisi.")]
        public string Password { get; init; } = string.Empty;

        [Required(ErrorMessage = "Jenis aplikasi harus diisi.")]
        public string JenisAplikasi { get; init; } = string.Empty;
    }
}
