namespace TanggapDaruratApi.Repositories.Interfaces
{
    public class NotifikasiItem
    {
        public int NotifikasiId { get; set; }
        public int? KejadianId { get; set; }
        public string Judul { get; set; } = string.Empty;
        public string Pesan { get; set; } = string.Empty;
        public string Tipe { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public interface INotifikasiRepository
    {
        Task<bool> CreateBroadcastAsync(string judul, string pesan, string tipe, int? kejadianId, string createdBy);
        Task<(IEnumerable<NotifikasiItem> Data, int TotalData)> GetAllForUserAsync(int userId, int pageNumber, int pageSize);
        Task<int> GetUnreadCountAsync(int userId);
        Task<bool> MarkAsReadAsync(int notifikasiId, int userId, string modifiedBy);
    }
}
