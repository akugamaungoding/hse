using Dapper;
using Microsoft.Data.SqlClient;
using TanggapDaruratApi.DTOs.Kejadian.Response;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Repositories.Interfaces;

namespace TanggapDaruratApi.Repositories.Implementations
{
    public class EvakuasiRepository(DatabaseConfig dbConfig, ILogger<EvakuasiRepository> logger) : IEvakuasiRepository
    {
        private readonly string _conn = dbConfig.ConnectionString;
        private readonly ILogger<EvakuasiRepository> _logger = logger;

        public async Task<bool> SeedForKejadianAsync(int kejadianId, string createdBy)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                await conn.ExecuteAsync(
                    "EXEC dbo.EVA_TRX_SeedForKejadian @KejadianId, @CreatedBy",
                    new { KejadianId = kejadianId, CreatedBy = createdBy });
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal seed data evakuasi lantai. | [{KejadianId}]", kejadianId);
                return false;
            }
        }

        public async Task<List<EvakuasiLantaiItem>> GetByKejadianAsync(int kejadianId)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var rows = await conn.QueryAsync<EvakuasiLantaiItem>(
                    "EXEC dbo.EVA_TRX_GetByKejadian @KejadianId", new { KejadianId = kejadianId });
                return rows.ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil daftar evakuasi lantai. | [{KejadianId}]", kejadianId);
                return [];
            }
        }

        public async Task<bool> ExistsAsync(int evakuasiId)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var count = await conn.ExecuteScalarAsync<int>("EXEC dbo.EVA_TRX_Exists @Id", new { Id = evakuasiId });
                return count > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal memeriksa data evakuasi lantai. | [{EvakuasiId}]", evakuasiId);
                return false;
            }
        }

        public async Task<int?> GetKejadianIdAsync(int evakuasiId)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.QueryFirstOrDefaultAsync<int?>(
                    "EXEC dbo.EVA_TRX_GetKejadianId @Id", new { Id = evakuasiId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil kejadian_id dari evakuasi. | [{EvakuasiId}]", evakuasiId);
                return null;
            }
        }

        public async Task<bool> SetInstruksiAsync(int evakuasiId, int userId, string modifiedBy)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var affected = await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.EVA_TRX_Instruksi @Id, @UserId, @ModifiedBy",
                    new { Id = evakuasiId, UserId = userId, ModifiedBy = modifiedBy });
                return affected > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mencatat instruksi evakuasi. | [{EvakuasiId}]", evakuasiId);
                return false;
            }
        }

        public async Task<bool> SetSelesaiAsync(int evakuasiId, int userId, string? catatan, string modifiedBy)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var affected = await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.EVA_TRX_Selesai @Id, @UserId, @Catatan, @ModifiedBy",
                    new { Id = evakuasiId, UserId = userId, Catatan = catatan, ModifiedBy = modifiedBy });
                return affected > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mencatat lantai kosong. | [{EvakuasiId}]", evakuasiId);
                return false;
            }
        }

        public async Task<bool> IsAllFloorsEmptyAsync(int kejadianId)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.ExecuteScalarAsync<bool>(
                    "EXEC dbo.EVA_TRX_IsAllFloorsEmpty @KejadianId", new { KejadianId = kejadianId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal memeriksa kelengkapan evakuasi lantai. | [{KejadianId}]", kejadianId);
                return false;
            }
        }
    }
}
