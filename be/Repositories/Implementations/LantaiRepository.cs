using Dapper;
using Microsoft.Data.SqlClient;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Repositories.Interfaces;

namespace TanggapDaruratApi.Repositories.Implementations
{
    public class LantaiRepository(DatabaseConfig dbConfig, ILogger<LantaiRepository> logger) : ILantaiRepository
    {
        private readonly string _conn = dbConfig.ConnectionString;
        private readonly ILogger<LantaiRepository> _logger = logger;

        public async Task<IEnumerable<LantaiItem>> GetAllActiveAsync()
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.QueryAsync<LantaiItem>("EXEC dbo.LAN_MST_GetAllActive");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil daftar lantai.");
                return [];
            }
        }
    }
}
