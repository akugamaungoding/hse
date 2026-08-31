using System.Collections.Generic;
using System.Threading.Tasks;
using TanggapDaruratApi.DTOs.Aset;

namespace TanggapDaruratApi.Repositories.Interfaces
{
    public interface IAsetRepository
    {
        Task<IEnumerable<AsetDto>> GetAllAsync(string? tipe = null, string? status = null);
        Task<AsetDto?> GetByIdAsync(string id);
        Task<bool> CreateInspeksiAsync(string asetId, int userIdPetugas, string status, string? catatan, string? fotoUrl, string? fotoBeforeUrl, string? fotoAfterUrl, string? formData, string actorUsername);
        Task<IEnumerable<InspeksiHistoryItem>> GetHistoryAsync(string asetId);
        Task<IEnumerable<InspeksiHistoryItem>> GetRecentInspeksiAsync(int limit);
        Task<bool> CreateAsync(CreateAsetDto dto, string actorUsername);
        Task<bool> UpdateAsync(string id, UpdateAsetDto dto, string actorUsername);
        Task<bool> DeleteAsync(string id, string actorUsername);
    }
}
