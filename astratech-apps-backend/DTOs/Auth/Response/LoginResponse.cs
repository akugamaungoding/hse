namespace astratech_apps_backend.DTOs.Auth.Response
{
    public record LoginResponse
    {
        public string Token { get; init; } = string.Empty;
        public string Nama { get; init; } = string.Empty;
        public List<Aplikasi> ListAplikasi { get; init; } = [];
        public DateTime? ExpiresAt { get; init; } = null;
        public string ErrorMessage { get; init; } = string.Empty;
    }
}
