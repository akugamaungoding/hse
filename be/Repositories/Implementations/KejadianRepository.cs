using Dapper;
using Microsoft.Data.SqlClient;
using TanggapDaruratApi.DTOs.Kejadian;
using TanggapDaruratApi.DTOs.Kejadian.Request;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Repositories.Interfaces;

namespace TanggapDaruratApi.Repositories.Implementations
{
    public class KejadianRepository(DatabaseConfig dbConfig, ILogger<KejadianRepository> logger) : IKejadianRepository
    {
        private readonly string _conn = dbConfig.ConnectionString;
        private readonly ILogger<KejadianRepository> _logger = logger;

        public async Task<int> CreateAsync(CreateKejadianRequest request, int userId, string kodeKejadian, string createdBy)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.KEJ_TRX_Create @KodeKejadian, @JenisKejadian, @Lokasi, @Deskripsi, @FotoUrl, @UserIdPelapor, @CreatedBy",
                    new
                    {
                        KodeKejadian = kodeKejadian,
                        request.JenisKejadian,
                        request.Lokasi,
                        request.Deskripsi,
                        request.FotoUrl,
                        UserIdPelapor = userId,
                        CreatedBy = createdBy
                    });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal membuat kejadian baru.");
                return 0;
            }
        }

        public async Task<(IEnumerable<Kejadian> Data, int TotalData)> GetAllAsync(GetAllKejadianRequest request)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                using var multi = await conn.QueryMultipleAsync(
                    "EXEC dbo.KEJ_TRX_GetData @Status, @Halaman, @Limit",
                    new { request.Status, Halaman = request.PageNumber, Limit = request.PageSize });

                var data = await multi.ReadAsync<Kejadian>();
                var total = await multi.ReadFirstOrDefaultAsync<int>();

                return (data, total);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil daftar kejadian.");
                return ([], 0);
            }
        }

        public async Task<Kejadian?> GetByIdAsync(int id)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.QueryFirstOrDefaultAsync<Kejadian>("EXEC dbo.KEJ_TRX_Detail @Id", new { Id = id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil detail kejadian. | [{Id}]", id);
                return null;
            }
        }

        public async Task<Kejadian?> GetAktifAsync()
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.QueryFirstOrDefaultAsync<Kejadian>("EXEC dbo.KEJ_TRX_GetAktif");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil kejadian aktif.");
                return null;
            }
        }

        public async Task<bool> SetValidasiAsync(int id, bool hasilValidasi, string? catatan, int userId, string modifiedBy)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var affected = await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.KEJ_TRX_Validasi @Id, @HasilValidasi, @Catatan, @UserId, @ModifiedBy",
                    new { Id = id, HasilValidasi = hasilValidasi, Catatan = catatan, UserId = userId, ModifiedBy = modifiedBy });
                return affected > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal menyimpan hasil validasi kejadian. | [{Id}]", id);
                return false;
            }
        }

        public async Task<bool> SetStatusAsync(int id, string status, string modifiedBy)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var affected = await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.KEJ_TRX_SetStatus @Id, @Status, @ModifiedBy",
                    new { Id = id, Status = status, ModifiedBy = modifiedBy });
                return affected > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengubah status kejadian. | [{Id}] -> [{Status}]", id, status);
                return false;
            }
        }

        public async Task<bool> SetPengumumanDaruratAsync(int id, int userId, string modifiedBy)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var affected = await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.KEJ_TRX_PengumumanDarurat @Id, @UserId, @ModifiedBy",
                    new { Id = id, UserId = userId, ModifiedBy = modifiedBy });
                return affected > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengumumkan kejadian darurat. | [{Id}]", id);
                return false;
            }
        }

        public async Task<bool> SetPengumumanAmanAsync(int id, string modifiedBy)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var affected = await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.KEJ_TRX_PengumumanAman @Id, @ModifiedBy",
                    new { Id = id, ModifiedBy = modifiedBy });
                return affected > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengumumkan kondisi aman. | [{Id}]", id);
                return false;
            }
        }

        public async Task<bool> SetDitetapkanAmanAsync(int id, int userId, string modifiedBy)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var affected = await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.KEJ_TRX_TetapkanAman @Id, @UserId, @ModifiedBy",
                    new { Id = id, UserId = userId, ModifiedBy = modifiedBy });
                return affected > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal menetapkan kondisi aman. | [{Id}]", id);
                return false;
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var count = await conn.ExecuteScalarAsync<int>("EXEC dbo.KEJ_TRX_Exists @Id", new { Id = id });
                return count > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal memeriksa keberadaan kejadian. | [{Id}]", id);
                return false;
            }
        }
    }
}
