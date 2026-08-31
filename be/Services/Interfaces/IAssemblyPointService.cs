using TanggapDaruratApi.DTOs.Kejadian.Response;
using TanggapDaruratApi.Repositories.Interfaces;

namespace TanggapDaruratApi.Services.Interfaces
{
    public interface IAssemblyPointService
    {
        Task<(bool Success, string Message)> ScanAsync(int kejadianId, int userId, string? kodeAssemblyPoint, string actorUsername);
        Task<AssemblyRekapItem> GetRekapAsync(int kejadianId);
        Task<List<AbsensiItem>> GetListAsync(int kejadianId);
        Task<(bool Success, string Message)> KonfirmasiLengkapAsync(int kejadianId, int userId, string actorUsername);
    }
}
