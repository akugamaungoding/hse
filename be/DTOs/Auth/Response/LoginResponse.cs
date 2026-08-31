namespace TanggapDaruratApi.DTOs.Auth.Response
{
    public record LoginResponse
    {
        public string Token { get; init; } = string.Empty;
        public int UserId { get; init; }
        public string Username { get; init; } = string.Empty;
        public string Nama { get; init; } = string.Empty;
        public string RoleCode { get; init; } = string.Empty;
        public string RoleName { get; init; } = string.Empty;
        public string? Email { get; init; }
        public string? NoHp { get; init; }
        public DateTime? ExpiresAt { get; init; }
        public string ErrorMessage { get; init; } = string.Empty;
    }
}
