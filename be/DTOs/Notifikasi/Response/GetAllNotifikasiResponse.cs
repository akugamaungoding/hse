using TanggapDaruratApi.Repositories.Interfaces;

namespace TanggapDaruratApi.DTOs.Notifikasi.Response
{
    public record GetAllNotifikasiResponse
    {
        public List<NotifikasiItem> Data { get; init; } = [];
        public int TotalData { get; init; }
        public int TotalHalaman { get; init; }
    }

    public record UnreadCountResponse
    {
        public int TotalUnread { get; init; }
    }
}
