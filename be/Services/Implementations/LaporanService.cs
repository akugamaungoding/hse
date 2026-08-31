using TanggapDaruratApi.DTOs.Kejadian.Request;
using TanggapDaruratApi.DTOs.Kejadian.Response;
using TanggapDaruratApi.Repositories.Interfaces;
using TanggapDaruratApi.Services.Interfaces;

namespace TanggapDaruratApi.Services.Implementations
{
    public class LaporanService(ILaporanRepository repo, IKejadianRepository kejadianRepository, ILogger<LaporanService> logger) : ILaporanService
    {
        private readonly ILaporanRepository _repo = repo;
        private readonly IKejadianRepository _kejadianRepository = kejadianRepository;
        private readonly ILogger<LaporanService> _logger = logger;

        public Task<LaporanItem?> GetAsync(int kejadianId) => _repo.GetAsync(kejadianId);

        public async Task<(bool Success, string Message)> CreateAsync(int kejadianId, string ringkasan, string? tindakLanjut, int userId, string actorUsername)
        {
            var kejadian = await _kejadianRepository.GetByIdAsync(kejadianId);
            if (kejadian == null) return (false, "Kejadian tidak ditemukan.");

            if (kejadian.WaktuPengumumanAman == null)
                return (false, "Laporan hanya dapat dibuat setelah pengumuman kondisi aman dikirim oleh PIC Control Room.");

            var ok = await _repo.CreateAsync(kejadianId, ringkasan, tindakLanjut, userId, actorUsername);
            if (!ok) return (false, "Gagal menyimpan laporan kejadian.");

            await _kejadianRepository.SetStatusAsync(kejadianId, "Selesai", actorUsername);
            return (true, "Laporan kejadian berhasil disimpan. Penanganan tanggap darurat ditutup.");
        }

        public async Task<GetAllKejadianResponse> GetAllReportedAsync(int pageNumber, int pageSize)
        {
            var (data, total) = await _repo.GetAllReportedAsync(pageNumber, pageSize);
            return new GetAllKejadianResponse
            {
                Data = [.. data],
                TotalData = total,
                TotalHalaman = total == 0 ? 0 : (int)Math.Ceiling((double)total / pageSize)
            };
        }
    }
}
