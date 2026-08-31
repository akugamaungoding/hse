using TanggapDaruratApi.DTOs.Kejadian;
using TanggapDaruratApi.DTOs.Kejadian.Request;
using TanggapDaruratApi.DTOs.Kejadian.Response;
using TanggapDaruratApi.Repositories.Interfaces;
using TanggapDaruratApi.Services.Interfaces;

namespace TanggapDaruratApi.Services.Implementations
{
    public class KejadianService(
        IKejadianRepository kejadianRepository,
        IEvakuasiRepository evakuasiRepository,
        IAssemblyPointRepository assemblyPointRepository,
        IP3KRepository p3kRepository,
        IPemadamanRepository pemadamanRepository,
        IKoordinasiRepository koordinasiRepository,
        ILaporanRepository laporanRepository,
        IUserRepository userRepository,
        INotifikasiRepository notifikasiRepository,
        ILogger<KejadianService> logger) : IKejadianService
    {
        private readonly IKejadianRepository _kejadianRepository = kejadianRepository;
        private readonly IEvakuasiRepository _evakuasiRepository = evakuasiRepository;
        private readonly IAssemblyPointRepository _assemblyPointRepository = assemblyPointRepository;
        private readonly IP3KRepository _p3kRepository = p3kRepository;
        private readonly IPemadamanRepository _pemadamanRepository = pemadamanRepository;
        private readonly IKoordinasiRepository _koordinasiRepository = koordinasiRepository;
        private readonly ILaporanRepository _laporanRepository = laporanRepository;
        private readonly IUserRepository _userRepository = userRepository;
        private readonly INotifikasiRepository _notifikasiRepository = notifikasiRepository;
        private readonly ILogger<KejadianService> _logger = logger;

        public async Task<CreateKejadianResponse> CreateAlertAsync(CreateKejadianRequest request, int userId, string actorUsername)
        {
            var kodeKejadian = $"DAR-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpperInvariant()}";
            var id = await _kejadianRepository.CreateAsync(request, userId, kodeKejadian, actorUsername);

            if (id == 0)
                return new CreateKejadianResponse { Message = "Emergency Alert gagal dikirim. Silakan coba lagi." };

            return new CreateKejadianResponse
            {
                KejadianId = id,
                KodeKejadian = kodeKejadian,
                Message = "Emergency Alert terkirim. Tim Identifikasi Kejadian Darurat akan segera memverifikasi."
            };
        }

        public async Task<GetAllKejadianResponse> GetAllAsync(GetAllKejadianRequest request)
        {
            var (data, total) = await _kejadianRepository.GetAllAsync(request);
            return new GetAllKejadianResponse
            {
                Data = [.. data],
                TotalData = total,
                TotalHalaman = total == 0 ? 0 : (int)Math.Ceiling((double)total / request.PageSize)
            };
        }

        public async Task<Kejadian?> GetAktifAsync() => await _kejadianRepository.GetAktifAsync();

        public async Task<KejadianStatusResponse?> GetStatusAsync(int id)
        {
            var header = await _kejadianRepository.GetByIdAsync(id);
            if (header == null) return null;

            var totalTerdaftar = await _userRepository.CountActiveByRoleCodeAsync("CIVITAS");

            var evakuasi = await _evakuasiRepository.GetByKejadianAsync(id);
            var assembly = await _assemblyPointRepository.GetRekapAsync(id, totalTerdaftar);
            var p3k = await _p3kRepository.GetAsync(id);
            var pemadaman = await _pemadamanRepository.GetAsync(id);
            var koordinasi = await _koordinasiRepository.GetHistoryAsync(id);
            var laporan = await _laporanRepository.GetAsync(id);

            return new KejadianStatusResponse
            {
                Header = header,
                Evakuasi = evakuasi,
                Assembly = assembly,
                P3K = p3k,
                Pemadaman = pemadaman,
                Koordinasi = koordinasi,
                Laporan = laporan
            };
        }

        public async Task<(bool Success, string Message)> ValidasiAsync(int id, ValidasiKejadianRequest request, int userId, string actorUsername)
        {
            if (!await _kejadianRepository.ExistsAsync(id))
                return (false, "Kejadian tidak ditemukan.");

            var ok = await _kejadianRepository.SetValidasiAsync(id, request.HasilValidasi, request.Catatan, userId, actorUsername);
            if (!ok)
                return (false, "Kejadian sudah divalidasi sebelumnya atau tidak dalam status menunggu validasi.");

            return request.HasilValidasi
                ? (true, "Kejadian dikonfirmasi sebagai tanggap darurat. Menunggu pengumuman dari PIC Control Room.")
                : (true, "Kejadian ditandai bukan tanggap darurat. Diteruskan ke GA untuk tindak lanjut kendala teknis.");
        }

        public async Task<(bool Success, string Message)> PengumumanDaruratAsync(int id, int userId, string actorUsername)
        {
            var ok = await _kejadianRepository.SetPengumumanDaruratAsync(id, userId, actorUsername);
            if (!ok)
                return (false, "Kejadian belum tervalidasi atau sudah diumumkan sebelumnya.");

            try
            {
                await _evakuasiRepository.SeedForKejadianAsync(id, actorUsername);
                await _kejadianRepository.SetStatusAsync(id, "Evakuasi", actorUsername);

                var kejadian = await _kejadianRepository.GetByIdAsync(id);
                await _notifikasiRepository.CreateBroadcastAsync(
                    "Keadaan Darurat",
                    $"Kejadian darurat ({kejadian?.JenisKejadian}) di {kejadian?.Lokasi}. Tetap tenang, ikuti arahan Floor Warden menuju assembly point.",
                    "Darurat",
                    id,
                    actorUsername);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal menyiapkan data evakuasi/notifikasi setelah pengumuman darurat. | [{Id}]", id);
            }

            return (true, "Pengumuman keadaan darurat berhasil dikirim ke seluruh civitas.");
        }

        public async Task<(bool Success, string Message)> PengumumanAmanAsync(int id, string actorUsername)
        {
            var ok = await _kejadianRepository.SetPengumumanAmanAsync(id, actorUsername);
            if (!ok)
                return (false, "Kondisi belum ditetapkan aman oleh Kepala KTID.");

            try
            {
                var kejadian = await _kejadianRepository.GetByIdAsync(id);
                await _notifikasiRepository.CreateBroadcastAsync(
                    "Kondisi Aman",
                    $"Kondisi di {kejadian?.Lokasi} telah dinyatakan aman. Civitas diizinkan kembali beraktivitas di dalam gedung.",
                    "Aman",
                    id,
                    actorUsername);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengirim notifikasi pengumuman aman. | [{Id}]", id);
            }

            return (true, "Pengumuman kondisi aman berhasil dikirim ke seluruh civitas.");
        }
    }
}
