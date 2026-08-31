using TanggapDaruratApi.DTOs.Kejadian.Response;

namespace TanggapDaruratApi.Services.Interfaces
{
    public interface IKoordinasiService
    {
        Task<List<KoordinasiItem>> GetHistoryAsync(int kejadianId);
        Task<(bool Success, string Message)> AddUpdateAsync(int kejadianId, string catatan, int userId, string actorUsername);
        Task<(bool Success, string Message)> TetapkanAmanAsync(int kejadianId, int userId, string actorUsername);
    }
}
