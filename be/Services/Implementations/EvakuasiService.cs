using TanggapDaruratApi.DTOs.Kejadian.Response;
using TanggapDaruratApi.Repositories.Interfaces;
using TanggapDaruratApi.Services.Interfaces;

namespace TanggapDaruratApi.Services.Implementations
{
    public class EvakuasiService(IEvakuasiRepository repo, IKejadianRepository kejadianRepository, ILogger<EvakuasiService> logger) : IEvakuasiService
    {
        private readonly IEvakuasiRepository _repo = repo;
        private readonly IKejadianRepository _kejadianRepository = kejadianRepository;
        private readonly ILogger<EvakuasiService> _logger = logger;

        public Task<List<EvakuasiLantaiItem>> GetByKejadianAsync(int kejadianId) => _repo.GetByKejadianAsync(kejadianId);

        public async Task<(bool Success, string Message)> InstruksiAsync(int evakuasiId, int userId, string actorUsername)
        {
            if (!await _repo.ExistsAsync(evakuasiId))
                return (false, "Data evakuasi lantai tidak ditemukan.");

            var ok = await _repo.SetInstruksiAsync(evakuasiId, userId, actorUsername);
            return ok
                ? (true, "Instruksi evakuasi berhasil diberikan.")
                : (false, "Gagal mencatat instruksi evakuasi.");
        }

        public async Task<(bool Success, string Message)> SelesaiAsync(int evakuasiId, int userId, string? catatan, string actorUsername)
        {
            var kejadianId = await _repo.GetKejadianIdAsync(evakuasiId);
            if (kejadianId == null)
                return (false, "Data evakuasi lantai tidak ditemukan.");

            var ok = await _repo.SetSelesaiAsync(evakuasiId, userId, catatan, actorUsername);
            if (!ok) return (false, "Gagal mencatat status lantai kosong.");

            try
            {
                if (await _repo.IsAllFloorsEmptyAsync(kejadianId.Value))
                    await _kejadianRepository.SetStatusAsync(kejadianId.Value, "Assembly Point", "SYSTEM");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal auto-advance status kejadian ke Assembly Point. | [{KejadianId}]", kejadianId);
            }

            return (true, "Lantai berhasil dilaporkan kosong.");
        }
    }
}
