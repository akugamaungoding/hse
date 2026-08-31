using Dapper;
using Microsoft.Data.SqlClient;
using TanggapDaruratApi.DTOs.Kejadian;
using TanggapDaruratApi.DTOs.Kejadian.Response;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Repositories.Interfaces;

namespace TanggapDaruratApi.Repositories.Implementations
{
    public class LaporanRepository(DatabaseConfig dbConfig, ILogger<LaporanRepository> logger) : ILaporanRepository
    {
        private readonly string _conn = dbConfig.ConnectionString;
        private readonly ILogger<LaporanRepository> _logger = logger;

        public async Task<LaporanItem?> GetAsync(int kejadianId)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.QueryFirstOrDefaultAsync<LaporanItem>(
                    "EXEC dbo.LAP_TRX_Get @KejadianId", new { KejadianId = kejadianId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil laporan kejadian. | [{KejadianId}]", kejadianId);
                return null;
            }
        }

        public async Task<bool> CreateAsync(int kejadianId, string ringkasan, string? tindakLanjut, int userId, string createdBy)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var affected = await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.LAP_TRX_Create @KejadianId, @Ringkasan, @TindakLanjut, @UserId, @CreatedBy",
                    new { KejadianId = kejadianId, Ringkasan = ringkasan, TindakLanjut = tindakLanjut, UserId = userId, CreatedBy = createdBy });
                return affected > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal menyimpan laporan kejadian. | [{KejadianId}]", kejadianId);
                return false;
            }
        }

        public async Task<(IEnumerable<Kejadian> Data, int TotalData)> GetAllReportedAsync(int pageNumber, int pageSize)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                using var multi = await conn.QueryMultipleAsync(
                    "EXEC dbo.LAP_TRX_GetAllReported @Halaman, @Limit",
                    new { Halaman = pageNumber, Limit = pageSize });

                var data = await multi.ReadAsync<Kejadian>();
                var total = await multi.ReadFirstOrDefaultAsync<int>();

                return (data, total);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil daftar laporan kejadian.");
                return ([], 0);
            }
        }
    }
}
