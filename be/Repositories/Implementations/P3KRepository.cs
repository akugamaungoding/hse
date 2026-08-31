using Dapper;
using Microsoft.Data.SqlClient;
using TanggapDaruratApi.DTOs.Kejadian.Response;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Repositories.Interfaces;

namespace TanggapDaruratApi.Repositories.Implementations
{
    public class P3KRepository(DatabaseConfig dbConfig, ILogger<P3KRepository> logger) : IP3KRepository
    {
        private readonly string _conn = dbConfig.ConnectionString;
        private readonly ILogger<P3KRepository> _logger = logger;

        public async Task<P3KItem?> GetAsync(int kejadianId)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.QueryFirstOrDefaultAsync<P3KItem>(
                    "EXEC dbo.PER_TRX_Get @KejadianId", new { KejadianId = kejadianId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil data P3K. | [{KejadianId}]", kejadianId);
                return null;
            }
        }

        public async Task<bool> UpsertAsync(int kejadianId, bool adaKorban, int? jumlahKorban, string? kondisiKorban,
            string? tindakan, bool perluAmbulans, int userId, string createdBy, string modifiedBy)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var affected = await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.PER_TRX_Upsert @KejadianId, @AdaKorban, @JumlahKorban, @KondisiKorban, @Tindakan, @PerluAmbulans, @UserId, @CreatedBy, @ModifiedBy",
                    new
                    {
                        KejadianId = kejadianId,
                        AdaKorban = adaKorban,
                        JumlahKorban = jumlahKorban,
                        KondisiKorban = kondisiKorban,
                        Tindakan = tindakan,
                        PerluAmbulans = perluAmbulans,
                        UserId = userId,
                        CreatedBy = createdBy,
                        ModifiedBy = modifiedBy
                    });
                return affected > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal menyimpan data P3K. | [{KejadianId}]", kejadianId);
                return false;
            }
        }
    }
}
