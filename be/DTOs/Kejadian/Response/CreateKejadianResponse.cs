namespace TanggapDaruratApi.DTOs.Kejadian.Response
{
    public record CreateKejadianResponse
    {
        public int KejadianId { get; init; }
        public string KodeKejadian { get; init; } = string.Empty;
        public string Message { get; init; } = string.Empty;
    }
}
