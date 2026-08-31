using Dapper;
using Microsoft.Data.SqlClient;
using TanggapDaruratApi.DTOs.Kejadian.Response;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Repositories.Interfaces;

namespace TanggapDaruratApi.Repositories.Implementations
{
    public class PemadamanRepository(DatabaseConfig dbConfig, ILogger<PemadamanRepository> logger) : IPemadamanRepository
    {
        private readonly string _conn = dbConfig.ConnectionString;
        private readonly ILogger<PemadamanRepository> _logger = logger;

        public async Task<PemadamanItem?> GetAsync(int kejadianId)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.QueryFirstOrDefaultAsync<PemadamanItem>(
                    "EXEC dbo.PEM_TRX_Get @KejadianId", new { KejadianId = kejadianId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil data pemadaman. | [{KejadianId}]", kejadianId);
                return null;
            }
        }

        public async Task<bool> UpsertAsync(int kejadianId, string? sumberApi, bool perluDamkar, string? hasilPemadaman,
            int userId, string createdBy, string modifiedBy)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var affected = await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.PEM_TRX_Upsert @KejadianId, @SumberApi, @PerluDamkar, @HasilPemadaman, @UserId, @CreatedBy, @ModifiedBy",
                    new
                    {
                        KejadianId = kejadianId,
                        SumberApi = sumberApi,
                        PerluDamkar = perluDamkar,
                        HasilPemadaman = hasilPemadaman,
                        UserId = userId,
                        CreatedBy = createdBy,
                        ModifiedBy = modifiedBy
                    });
                return affected > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal menyimpan data pemadaman. | [{KejadianId}]", kejadianId);
                return false;
            }
        }
    }
}
