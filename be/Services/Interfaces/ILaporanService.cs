using TanggapDaruratApi.DTOs.Kejadian.Response;

namespace TanggapDaruratApi.Services.Interfaces
{
    public interface ILaporanService
    {
        Task<LaporanItem?> GetAsync(int kejadianId);
        Task<(bool Success, string Message)> CreateAsync(int kejadianId, string ringkasan, string? tindakLanjut, int userId, string actorUsername);
        Task<GetAllKejadianResponse> GetAllReportedAsync(int pageNumber, int pageSize);
    }
}
