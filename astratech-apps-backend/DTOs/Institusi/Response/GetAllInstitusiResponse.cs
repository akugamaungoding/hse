namespace astratech_apps_backend.DTOs.Institusi.Response
{
    public record GetAllInstitusiResponse
    {
        public List<Institusi> Data { get; init; } = [];
        public int TotalData { get; init; } = 0;
        public int TotalHalaman { get; init; } = 0;
    }
}
