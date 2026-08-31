using TanggapDaruratApi.DTOs.Kejadian.Response;
using TanggapDaruratApi.Repositories.Interfaces;
using TanggapDaruratApi.Services.Interfaces;

namespace TanggapDaruratApi.Services.Implementations
{
    public class KoordinasiService(IKoordinasiRepository repo, IKejadianRepository kejadianRepository, ILogger<KoordinasiService> logger) : IKoordinasiService
    {
        private readonly IKoordinasiRepository _repo = repo;
        private readonly IKejadianRepository _kejadianRepository = kejadianRepository;
        private readonly ILogger<KoordinasiService> _logger = logger;

        public Task<List<KoordinasiItem>> GetHistoryAsync(int kejadianId) => _repo.GetHistoryAsync(kejadianId);

        public async Task<(bool Success, string Message)> AddUpdateAsync(int kejadianId, string catatan, int userId, string actorUsername)
        {
            var ok = await _repo.AddUpdateAsync(kejadianId, catatan, userId, actorUsername);
            return ok ? (true, "Update kondisi berhasil dicatat.") : (false, "Gagal mencatat update kondisi.");
        }

        public async Task<(bool Success, string Message)> TetapkanAmanAsync(int kejadianId, int userId, string actorUsername)
        {
            var ok = await _kejadianRepository.SetDitetapkanAmanAsync(kejadianId, userId, actorUsername);
            return ok
                ? (true, "Kondisi ditetapkan aman. Menunggu pengumuman dari PIC Control Room.")
                : (false, "Kondisi hanya dapat ditetapkan aman setelah tahap Assembly Point/Penanganan berjalan.");
        }
    }
}
