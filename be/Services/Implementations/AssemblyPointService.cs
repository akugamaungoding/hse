using TanggapDaruratApi.DTOs.Kejadian.Response;
using TanggapDaruratApi.Repositories.Interfaces;
using TanggapDaruratApi.Services.Interfaces;

namespace TanggapDaruratApi.Services.Implementations
{
    public class AssemblyPointService(
        IAssemblyPointRepository repo,
        IUserRepository userRepository,
        ILogger<AssemblyPointService> logger) : IAssemblyPointService
    {
        private readonly IAssemblyPointRepository _repo = repo;
        private readonly IUserRepository _userRepository = userRepository;
        private readonly ILogger<AssemblyPointService> _logger = logger;

        public async Task<(bool Success, string Message)> ScanAsync(int kejadianId, int userId, string? kodeAssemblyPoint, string actorUsername)
        {
            var ok = await _repo.ScanAsync(kejadianId, userId, kodeAssemblyPoint, actorUsername);
            return ok
                ? (true, "Absensi berhasil dicatat. Terima kasih telah menuju assembly point.")
                : (false, "Gagal mencatat absensi. Anda mungkin sudah tercatat sebelumnya.");
        }

        public async Task<AssemblyRekapItem> GetRekapAsync(int kejadianId)
        {
            var totalTerdaftar = await _userRepository.CountActiveByRoleCodeAsync("CIVITAS");
            return await _repo.GetRekapAsync(kejadianId, totalTerdaftar);
        }

        public Task<List<AbsensiItem>> GetListAsync(int kejadianId) => _repo.GetListAsync(kejadianId);

        public async Task<(bool Success, string Message)> KonfirmasiLengkapAsync(int kejadianId, int userId, string actorUsername)
        {
            var ok = await _repo.KonfirmasiLengkapAsync(kejadianId, userId, actorUsername);
            return ok
                ? (true, "Pendataan assembly point dikonfirmasi lengkap.")
                : (false, "Gagal mengonfirmasi kelengkapan pendataan.");
        }
    }
}
