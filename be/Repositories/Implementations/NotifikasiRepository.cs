using Dapper;
using Microsoft.Data.SqlClient;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Repositories.Interfaces;

namespace TanggapDaruratApi.Repositories.Implementations
{
    public class NotifikasiRepository(DatabaseConfig dbConfig, ILogger<NotifikasiRepository> logger) : INotifikasiRepository
    {
        private readonly string _conn = dbConfig.ConnectionString;
        private readonly ILogger<NotifikasiRepository> _logger = logger;

        public async Task<bool> CreateBroadcastAsync(string judul, string pesan, string tipe, int? kejadianId, string createdBy)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var affected = await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.NOT_TRX_Broadcast @KejadianId, @Judul, @Pesan, @Tipe, @CreatedBy",
                    new { KejadianId = kejadianId, Judul = judul, Pesan = pesan, Tipe = tipe, CreatedBy = createdBy });
                return affected > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal membuat notifikasi broadcast.");
                return false;
            }
        }

        public async Task<(IEnumerable<NotifikasiItem> Data, int TotalData)> GetAllForUserAsync(int userId, int pageNumber, int pageSize)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                using var multi = await conn.QueryMultipleAsync(
                    "EXEC dbo.NOT_TRX_GetAll @UserId, @Halaman, @Limit",
                    new { UserId = userId, Halaman = pageNumber, Limit = pageSize });

                var data = await multi.ReadAsync<NotifikasiItem>();
                var total = await multi.ReadFirstOrDefaultAsync<int>();

                return (data, total);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil daftar notifikasi. | [{UserId}]", userId);
                return ([], 0);
            }
        }

        public async Task<int> GetUnreadCountAsync(int userId)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.ExecuteScalarAsync<int>("EXEC dbo.NOT_TRX_GetUnreadCount @UserId", new { UserId = userId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal menghitung notifikasi belum dibaca. | [{UserId}]", userId);
                return 0;
            }
        }

        public async Task<bool> MarkAsReadAsync(int notifikasiId, int userId, string modifiedBy)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var affected = await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.NOT_TRX_MarkRead @Id, @UserId, @ModifiedBy",
                    new { Id = notifikasiId, UserId = userId, ModifiedBy = modifiedBy });
                return affected > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal menandai notifikasi telah dibaca. | [{NotifikasiId}]", notifikasiId);
                return false;
            }
        }
    }
}
