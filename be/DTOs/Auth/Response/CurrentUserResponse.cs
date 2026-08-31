namespace TanggapDaruratApi.DTOs.Auth.Response
{
    public record CurrentUserResponse
    {
        public int UserId { get; init; }
        public string Username { get; init; } = string.Empty;
        public string Nama { get; init; } = string.Empty;
        public string? Email { get; init; }
        public string? NoHp { get; init; }
        public string RoleCode { get; init; } = string.Empty;
        public string RoleName { get; init; } = string.Empty;
    }
}
