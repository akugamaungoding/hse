namespace astratech_apps_backend.DTOs.Auth
{
    public record Menu
    {
        public int Id { get; init; }
        public int ParentId { get; init; }
        public string Icon { get; init; } = string.Empty;
        public string Label { get; init; } = string.Empty;
        public string Href { get; init; } = string.Empty;
        public List<Menu> Children { get; set; } = [];
    }
}
