using TanggapDaruratApi.DTOs.Notifikasi.Response;
using TanggapDaruratApi.Repositories.Interfaces;
using TanggapDaruratApi.Services.Interfaces;

namespace TanggapDaruratApi.Services.Implementations
{
    public class NotifikasiService(INotifikasiRepository repo) : INotifikasiService
    {
        private readonly INotifikasiRepository _repo = repo;

        public async Task<GetAllNotifikasiResponse> GetAllAsync(int userId, int pageNumber, int pageSize)
        {
            var (data, total) = await _repo.GetAllForUserAsync(userId, pageNumber, pageSize);
            return new GetAllNotifikasiResponse
            {
                Data = [.. data],
                TotalData = total,
                TotalHalaman = total == 0 ? 0 : (int)Math.Ceiling((double)total / pageSize)
            };
        }

        public Task<int> GetUnreadCountAsync(int userId) => _repo.GetUnreadCountAsync(userId);

        public async Task<(bool Success, string Message)> MarkAsReadAsync(int notifikasiId, int userId, string actorUsername)
        {
            var ok = await _repo.MarkAsReadAsync(notifikasiId, userId, actorUsername);
            return ok ? (true, "Notifikasi ditandai telah dibaca.") : (false, "Notifikasi tidak ditemukan.");
        }
    }
}
