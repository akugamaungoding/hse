using TanggapDaruratApi.DTOs.Kejadian.Response;
using TanggapDaruratApi.Repositories.Interfaces;
using TanggapDaruratApi.Services.Interfaces;

namespace TanggapDaruratApi.Services.Implementations
{
    public class PemadamanService(IPemadamanRepository repo, IKejadianRepository kejadianRepository, ILogger<PemadamanService> logger) : IPemadamanService
    {
        private readonly IPemadamanRepository _repo = repo;
        private readonly IKejadianRepository _kejadianRepository = kejadianRepository;
        private readonly ILogger<PemadamanService> _logger = logger;

        public Task<PemadamanItem?> GetAsync(int kejadianId) => _repo.GetAsync(kejadianId);

        public async Task<(bool Success, string Message)> UpsertAsync(int kejadianId, string? sumberApi, bool perluDamkar,
            string? hasilPemadaman, int userId, string actorUsername)
        {
            var ok = await _repo.UpsertAsync(kejadianId, sumberApi, perluDamkar, hasilPemadaman, userId, actorUsername, actorUsername);
            if (!ok) return (false, "Gagal menyimpan laporan pemadaman.");

            if (perluDamkar)
            {
                try
                {
                    var kejadian = await _kejadianRepository.GetByIdAsync(kejadianId);
                    if (kejadian?.Status == "Assembly Point")
                        await _kejadianRepository.SetStatusAsync(kejadianId, "Penanganan", actorUsername);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Gagal mengubah status kejadian ke Penanganan setelah permintaan DAMKAR. | [{KejadianId}]", kejadianId);
                }
            }

            return (true, "Laporan pemadaman berhasil disimpan.");
        }
    }
}
