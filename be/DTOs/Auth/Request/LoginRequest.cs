using System.ComponentModel.DataAnnotations;

namespace TanggapDaruratApi.DTOs.Auth.Request
{
    public record LoginRequest
    {
        [Required(ErrorMessage = "Username harus diisi.")]
        [StringLength(50)]
        public string Username { get; init; } = string.Empty;

        [Required(ErrorMessage = "Kata sandi harus diisi.")]
        public string Password { get; init; } = string.Empty;
    }
}
