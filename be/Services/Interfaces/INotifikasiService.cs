using TanggapDaruratApi.DTOs.Notifikasi.Response;

namespace TanggapDaruratApi.Services.Interfaces
{
    public interface INotifikasiService
    {
        Task<GetAllNotifikasiResponse> GetAllAsync(int userId, int pageNumber, int pageSize);
        Task<int> GetUnreadCountAsync(int userId);
        Task<(bool Success, string Message)> MarkAsReadAsync(int notifikasiId, int userId, string actorUsername);
    }
}
