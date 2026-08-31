namespace TanggapDaruratApi.DTOs.Kejadian.Request
{
    public record GetAllKejadianRequest
    {
        public string? Status { get; init; }
        public string? Urut { get; init; }
        public int PageNumber { get; init; } = 1;
        public int PageSize { get; init; } = 20;
    }
}
