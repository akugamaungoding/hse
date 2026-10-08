using System.ComponentModel.DataAnnotations;

namespace astratech_apps_backend.DTOs.Auth.Request
{
    public record PermissionRequest
    {
        [Required(ErrorMessage = "Nama akun harus diisi.")]
        [StringLength(50)]
        public string Username { get; init; } = string.Empty;

        [Required(ErrorMessage = "ID aplikasi harus diisi.")]
        [StringLength(5)]
        public string AppId { get; init; } = string.Empty;

        [Required(ErrorMessage = "ID role harus diisi.")]
        [StringLength(10)]
        public string RoleId { get; init; } = string.Empty;
    }
}
