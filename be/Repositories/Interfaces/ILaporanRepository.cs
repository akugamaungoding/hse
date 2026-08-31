using TanggapDaruratApi.DTOs.Kejadian.Response;
using TanggapDaruratApi.DTOs.Kejadian;

namespace TanggapDaruratApi.Repositories.Interfaces
{
    public interface ILaporanRepository
    {
        Task<LaporanItem?> GetAsync(int kejadianId);
        Task<bool> CreateAsync(int kejadianId, string ringkasan, string? tindakLanjut, int userId, string createdBy);
        Task<(IEnumerable<Kejadian> Data, int TotalData)> GetAllReportedAsync(int pageNumber, int pageSize);
    }
}
