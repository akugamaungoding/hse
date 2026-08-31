using TanggapDaruratApi.DTOs.Kejadian.Response;

namespace TanggapDaruratApi.Services.Interfaces
{
    public interface IP3KService
    {
        Task<P3KItem?> GetAsync(int kejadianId);
        Task<(bool Success, string Message)> UpsertAsync(int kejadianId, bool adaKorban, int? jumlahKorban,
            string? kondisiKorban, string? tindakan, bool perluAmbulans, int userId, string actorUsername);
    }
}
