using Dapper;
using Microsoft.Data.SqlClient;
using TanggapDaruratApi.DTOs.Auth;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Repositories.Interfaces;

namespace TanggapDaruratApi.Repositories.Implementations
{
    public class UserRepository(DatabaseConfig dbConfig, ILogger<UserRepository> logger) : IUserRepository
    {
        private readonly string _conn = dbConfig.ConnectionString;
        private readonly ILogger<UserRepository> _logger = logger;

        public async Task<UserAccount?> GetByUsernameAsync(string username)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.QueryFirstOrDefaultAsync<UserAccount>(
                    "EXEC dbo.USE_MST_GetByUsername @Username", new { Username = username });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil user berdasarkan username. | [{Username}]", username);
                return null;
            }
        }

        public async Task<UserAccount?> GetByIdAsync(int userId)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.QueryFirstOrDefaultAsync<UserAccount>(
                    "EXEC dbo.USE_MST_GetById @Id", new { Id = userId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil user berdasarkan id. | [{UserId}]", userId);
                return null;
            }
        }

        public async Task<IEnumerable<UserAccount>> GetByRoleCodeAsync(string roleCode)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.QueryAsync<UserAccount>(
                    "EXEC dbo.USE_MST_GetByRoleCode @RoleCode", new { RoleCode = roleCode });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil daftar user berdasarkan role. | [{RoleCode}]", roleCode);
                return [];
            }
        }

        public async Task<int> CountActiveByRoleCodeAsync(string roleCode)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.USE_MST_CountActiveByRoleCode @RoleCode", new { RoleCode = roleCode });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal menghitung user aktif berdasarkan role. | [{RoleCode}]", roleCode);
                return 0;
            }
        }
    }
}
