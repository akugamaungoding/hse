using TanggapDaruratApi.DTOs.Kejadian.Response;
using TanggapDaruratApi.Repositories.Interfaces;
using TanggapDaruratApi.Services.Interfaces;

namespace TanggapDaruratApi.Services.Implementations
{
    public class P3KService(IP3KRepository repo, IKejadianRepository kejadianRepository, ILogger<P3KService> logger) : IP3KService
    {
        private readonly IP3KRepository _repo = repo;
        private readonly IKejadianRepository _kejadianRepository = kejadianRepository;
        private readonly ILogger<P3KService> _logger = logger;

        public Task<P3KItem?> GetAsync(int kejadianId) => _repo.GetAsync(kejadianId);

        public async Task<(bool Success, string Message)> UpsertAsync(int kejadianId, bool adaKorban, int? jumlahKorban,
            string? kondisiKorban, string? tindakan, bool perluAmbulans, int userId, string actorUsername)
        {
            var ok = await _repo.UpsertAsync(kejadianId, adaKorban, jumlahKorban, kondisiKorban, tindakan, perluAmbulans, userId, actorUsername, actorUsername);
            if (!ok) return (false, "Gagal menyimpan laporan pertolongan pertama.");

            if (perluAmbulans)
            {
                try
                {
                    var kejadian = await _kejadianRepository.GetByIdAsync(kejadianId);
                    if (kejadian?.Status == "Assembly Point")
                        await _kejadianRepository.SetStatusAsync(kejadianId, "Penanganan", actorUsername);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Gagal mengubah status kejadian ke Penanganan setelah permintaan ambulans. | [{KejadianId}]", kejadianId);
                }
            }

            return (true, "Laporan pertolongan pertama berhasil disimpan.");
        }
    }
}
