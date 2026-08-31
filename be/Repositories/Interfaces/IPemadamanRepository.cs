using TanggapDaruratApi.DTOs.Kejadian.Response;

namespace TanggapDaruratApi.Repositories.Interfaces
{
    public interface IPemadamanRepository
    {
        Task<PemadamanItem?> GetAsync(int kejadianId);
        Task<bool> UpsertAsync(int kejadianId, string? sumberApi, bool perluDamkar, string? hasilPemadaman, int userId, string createdBy, string modifiedBy);
    }
}
