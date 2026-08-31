using TanggapDaruratApi.DTOs.Kejadian.Response;

namespace TanggapDaruratApi.Repositories.Interfaces
{
    public interface IP3KRepository
    {
        Task<P3KItem?> GetAsync(int kejadianId);
        Task<bool> UpsertAsync(int kejadianId, bool adaKorban, int? jumlahKorban, string? kondisiKorban,
            string? tindakan, bool perluAmbulans, int userId, string createdBy, string modifiedBy);
    }
}
