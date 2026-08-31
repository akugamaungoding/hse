using Dapper;
using Microsoft.Data.SqlClient;
using TanggapDaruratApi.DTOs.Kejadian.Response;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Repositories.Interfaces;

namespace TanggapDaruratApi.Repositories.Implementations
{
    public class KoordinasiRepository(DatabaseConfig dbConfig, ILogger<KoordinasiRepository> logger) : IKoordinasiRepository
    {
        private readonly string _conn = dbConfig.ConnectionString;
        private readonly ILogger<KoordinasiRepository> _logger = logger;

        public async Task<List<KoordinasiItem>> GetHistoryAsync(int kejadianId)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var rows = await conn.QueryAsync<KoordinasiItem>(
                    "EXEC dbo.KOO_TRX_GetHistory @KejadianId", new { KejadianId = kejadianId });
                return rows.ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil histori koordinasi. | [{KejadianId}]", kejadianId);
                return [];
            }
        }

        public async Task<bool> AddUpdateAsync(int kejadianId, string catatan, int userId, string createdBy)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var affected = await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.KOO_TRX_AddUpdate @KejadianId, @Catatan, @UserId, @CreatedBy",
                    new { KejadianId = kejadianId, Catatan = catatan, UserId = userId, CreatedBy = createdBy });
                return affected > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal menyimpan update koordinasi. | [{KejadianId}]", kejadianId);
                return false;
            }
        }
    }
}
