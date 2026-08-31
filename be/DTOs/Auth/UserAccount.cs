namespace TanggapDaruratApi.DTOs.Auth
{
    public class UserAccount
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Nama { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? NoHp { get; set; }
        public int RoleId { get; set; }
        public string RoleCode { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
