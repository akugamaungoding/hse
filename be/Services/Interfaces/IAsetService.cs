using System.Collections.Generic;
using System.Threading.Tasks;
using TanggapDaruratApi.DTOs.Aset;

namespace TanggapDaruratApi.Services.Interfaces
{
    public interface IAsetService
    {
        Task<IEnumerable<AsetDto>> GetAllAsync(string? tipe = null, string? status = null);
        Task<AsetDto?> GetByIdAsync(string id);
        Task<bool> SubmitInspeksiAsync(string asetId, int userIdPetugas, InspeksiRequest request, string actorUsername);
        Task<IEnumerable<InspeksiHistoryItem>> GetHistoryAsync(string asetId);
        Task<IEnumerable<InspeksiHistoryItem>> GetRecentInspeksiAsync(int limit);
        Task<bool> CreateAsync(CreateAsetDto dto, string actorUsername);
        Task<bool> UpdateAsync(string id, UpdateAsetDto dto, string actorUsername);
        Task<bool> DeleteAsync(string id, string actorUsername);
    }
}
