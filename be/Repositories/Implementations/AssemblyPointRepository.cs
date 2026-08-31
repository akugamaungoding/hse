using Dapper;
using Microsoft.Data.SqlClient;
using TanggapDaruratApi.DTOs.Kejadian.Response;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Repositories.Interfaces;

namespace TanggapDaruratApi.Repositories.Implementations
{
    public class AssemblyPointRepository(DatabaseConfig dbConfig, ILogger<AssemblyPointRepository> logger) : IAssemblyPointRepository
    {
        private readonly string _conn = dbConfig.ConnectionString;
        private readonly ILogger<AssemblyPointRepository> _logger = logger;

        public async Task<bool> ScanAsync(int kejadianId, int userId, string? kodeAssemblyPoint, string createdBy)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var affected = await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.ASM_TRX_Scan @KejadianId, @UserId, @KodeAssemblyPoint, @CreatedBy",
                    new { KejadianId = kejadianId, UserId = userId, KodeAssemblyPoint = kodeAssemblyPoint, CreatedBy = createdBy });
                return affected > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mencatat absensi assembly point. | [{KejadianId}] [{UserId}]", kejadianId, userId);
                return false;
            }
        }

        public async Task<List<AbsensiItem>> GetListAsync(int kejadianId)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var rows = await conn.QueryAsync<AbsensiItem>(
                    "EXEC dbo.ASM_TRX_GetList @KejadianId", new { KejadianId = kejadianId });
                return rows.ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil daftar absensi assembly point. | [{KejadianId}]", kejadianId);
                return [];
            }
        }

        public async Task<AssemblyRekapItem> GetRekapAsync(int kejadianId, int totalTerdaftar)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var rekap = await conn.QueryFirstOrDefaultAsync<AssemblyRekapItem>(
                    "EXEC dbo.ASM_TRX_GetRekap @KejadianId, @TotalTerdaftar",
                    new { KejadianId = kejadianId, TotalTerdaftar = totalTerdaftar });
                return rekap ?? new AssemblyRekapItem { TotalTerdaftar = totalTerdaftar };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil rekap assembly point. | [{KejadianId}]", kejadianId);
                return new AssemblyRekapItem { TotalTerdaftar = totalTerdaftar };
            }
        }

        public async Task<bool> KonfirmasiLengkapAsync(int kejadianId, int userId, string createdBy)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var affected = await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.ASM_TRX_KonfirmasiLengkap @KejadianId, @UserId, @CreatedBy",
                    new { KejadianId = kejadianId, UserId = userId, CreatedBy = createdBy });
                return affected > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal konfirmasi kelengkapan assembly point. | [{KejadianId}]", kejadianId);
                return false;
            }
        }
    }
}
