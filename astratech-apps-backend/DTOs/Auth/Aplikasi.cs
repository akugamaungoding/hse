namespace astratech_apps_backend.DTOs.Auth
{
    public record Aplikasi
    {
        public string NamaAplikasi { get; init; } = string.Empty;
        public string NamaRole { get; init; } = string.Empty;
        public string Root { get; init; } = string.Empty;
        public string AppId { get; init; } = string.Empty;
        public string RoleId { get; init; } = string.Empty;
        public string AppIcon { get; init; } = string.Empty;
    }
}
