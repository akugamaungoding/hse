namespace astratech_apps_backend.DTOs.Auth.Response
{
    public record PermissionResponse
    {
        public string Token { get; init; } = string.Empty;
        public List<string> ListPermission { get; init; } = [];
        public DateTime? ExpiresAt { get; init; } = null;
        public string ErrorMessage { get; init; } = string.Empty;
    }
}
