namespace TanggapDaruratApi.DTOs.Kejadian.Response
{
    public record GetAllKejadianResponse
    {
        public List<Kejadian> Data { get; init; } = [];
        public int TotalData { get; init; }
        public int TotalHalaman { get; init; }
    }
}
