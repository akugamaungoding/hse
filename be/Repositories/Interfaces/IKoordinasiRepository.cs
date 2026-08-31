using TanggapDaruratApi.DTOs.Kejadian.Response;

namespace TanggapDaruratApi.Repositories.Interfaces
{
    public interface IKoordinasiRepository
    {
        Task<List<KoordinasiItem>> GetHistoryAsync(int kejadianId);
        Task<bool> AddUpdateAsync(int kejadianId, string catatan, int userId, string createdBy);
    }
}
