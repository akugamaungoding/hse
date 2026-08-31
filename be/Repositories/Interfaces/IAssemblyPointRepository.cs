using TanggapDaruratApi.DTOs.Kejadian.Response;

namespace TanggapDaruratApi.Repositories.Interfaces
{
    public class AbsensiItem
    {
        public int UserId { get; set; }
        public string Nama { get; set; } = string.Empty;
        public DateTime WaktuScan { get; set; }
    }

    public interface IAssemblyPointRepository
    {
        Task<bool> ScanAsync(int kejadianId, int userId, string? kodeAssemblyPoint, string createdBy);
        Task<List<AbsensiItem>> GetListAsync(int kejadianId);
        Task<AssemblyRekapItem> GetRekapAsync(int kejadianId, int totalTerdaftar);
        Task<bool> KonfirmasiLengkapAsync(int kejadianId, int userId, string createdBy);
    }
}
