namespace astratech_apps_backend.DTOs.Auth.Response
{
    public record MenuResponse
    {
        public List<Menu> ListMenu { get; init; } = [];
        public string ErrorMessage { get; init; } = string.Empty;
    }
}
