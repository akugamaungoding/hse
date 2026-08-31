using TanggapDaruratApi.DTOs.Kejadian.Response;

namespace TanggapDaruratApi.Services.Interfaces
{
    public interface IPemadamanService
    {
        Task<PemadamanItem?> GetAsync(int kejadianId);
        Task<(bool Success, string Message)> UpsertAsync(int kejadianId, string? sumberApi, bool perluDamkar,
            string? hasilPemadaman, int userId, string actorUsername);
    }
}
