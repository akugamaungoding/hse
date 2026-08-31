using System.Collections.Generic;
using System.Threading.Tasks;
using TanggapDaruratApi.DTOs.Aset;
using TanggapDaruratApi.Repositories.Interfaces;
using TanggapDaruratApi.Services.Interfaces;

namespace TanggapDaruratApi.Services.Implementations
{
    public class AsetService(IAsetRepository repo) : IAsetService
    {
        private readonly IAsetRepository _repo = repo;

        public Task<IEnumerable<AsetDto>> GetAllAsync(string? tipe = null, string? status = null)
            => _repo.GetAllAsync(tipe, status);

        public Task<AsetDto?> GetByIdAsync(string id)
            => _repo.GetByIdAsync(id);

        public Task<bool> SubmitInspeksiAsync(string asetId, int userIdPetugas, InspeksiRequest request, string actorUsername)
            => _repo.CreateInspeksiAsync(asetId, userIdPetugas, request.Status, request.Catatan, request.FotoUrl, request.FotoBeforeUrl, request.FotoAfterUrl, request.FormData, actorUsername);

        public Task<IEnumerable<InspeksiHistoryItem>> GetHistoryAsync(string asetId)
            => _repo.GetHistoryAsync(asetId);

        public Task<IEnumerable<InspeksiHistoryItem>> GetRecentInspeksiAsync(int limit)
            => _repo.GetRecentInspeksiAsync(limit);

        public Task<bool> CreateAsync(CreateAsetDto dto, string actorUsername)
            => _repo.CreateAsync(dto, actorUsername);

        public Task<bool> UpdateAsync(string id, UpdateAsetDto dto, string actorUsername)
            => _repo.UpdateAsync(id, dto, actorUsername);

        public Task<bool> DeleteAsync(string id, string actorUsername)
            => _repo.DeleteAsync(id, actorUsername);
    }
}
