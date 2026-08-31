using TanggapDaruratApi.DTOs.Kejadian.Response;

namespace TanggapDaruratApi.Repositories.Interfaces
{
    public interface IEvakuasiRepository
    {
        Task<bool> SeedForKejadianAsync(int kejadianId, string createdBy);

        Task<List<EvakuasiLantaiItem>> GetByKejadianAsync(int kejadianId);
        Task<bool> ExistsAsync(int evakuasiId);
        Task<int?> GetKejadianIdAsync(int evakuasiId);
        Task<bool> SetInstruksiAsync(int evakuasiId, int userId, string modifiedBy);
        Task<bool> SetSelesaiAsync(int evakuasiId, int userId, string? catatan, string modifiedBy);

        Task<bool> IsAllFloorsEmptyAsync(int kejadianId);
    }
}
