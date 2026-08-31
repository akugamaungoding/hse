using TanggapDaruratApi.DTOs.Kejadian.Response;

namespace TanggapDaruratApi.Services.Interfaces
{
    public interface IEvakuasiService
    {
        Task<List<EvakuasiLantaiItem>> GetByKejadianAsync(int kejadianId);
        Task<(bool Success, string Message)> InstruksiAsync(int evakuasiId, int userId, string actorUsername);
        Task<(bool Success, string Message)> SelesaiAsync(int evakuasiId, int userId, string? catatan, string actorUsername);
    }
}
