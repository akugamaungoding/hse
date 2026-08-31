using TanggapDaruratApi.DTOs.Kejadian;
using TanggapDaruratApi.DTOs.Kejadian.Request;
using TanggapDaruratApi.DTOs.Kejadian.Response;

namespace TanggapDaruratApi.Services.Interfaces
{
    public interface IKejadianService
    {
        Task<CreateKejadianResponse> CreateAlertAsync(CreateKejadianRequest request, int userId, string actorUsername);
        Task<GetAllKejadianResponse> GetAllAsync(GetAllKejadianRequest request);
        Task<KejadianStatusResponse?> GetStatusAsync(int id);
        Task<Kejadian?> GetAktifAsync();
        Task<(bool Success, string Message)> ValidasiAsync(int id, ValidasiKejadianRequest request, int userId, string actorUsername);
        Task<(bool Success, string Message)> PengumumanDaruratAsync(int id, int userId, string actorUsername);
        Task<(bool Success, string Message)> PengumumanAmanAsync(int id, string actorUsername);
    }
}
