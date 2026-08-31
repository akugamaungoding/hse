using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TanggapDaruratApi.DTOs.Aset;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Repositories.Interfaces;

namespace TanggapDaruratApi.Repositories.Implementations
{
    public class AsetRepository(DatabaseConfig dbConfig, ILogger<AsetRepository> logger) : IAsetRepository
    {
        private readonly string _conn = dbConfig.ConnectionString;
        private readonly ILogger<AsetRepository> _logger = logger;

        public async Task<IEnumerable<AsetDto>> GetAllAsync(string? tipe = null, string? status = null)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.QueryAsync<AsetDto>(
                    "EXEC dbo.ASE_MST_GetAll @Tipe, @Status", new { Tipe = tipe, Status = status });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil daftar aset. | Tipe: {Tipe}, Status: {Status}", tipe, status);
                return [];
            }
        }

        public async Task<AsetDto?> GetByIdAsync(string id)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.QueryFirstOrDefaultAsync<AsetDto>(
                    "EXEC dbo.ASE_MST_GetById @Id", new { Id = id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil detail aset. | ID: {Id}", id);
                return null;
            }
        }

        public async Task<bool> CreateInspeksiAsync(string asetId, int userIdPetugas, string status, string? catatan, string? fotoUrl, string? fotoBeforeUrl, string? fotoAfterUrl, string? formData, string actorUsername)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var rows = await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.ASE_TRX_InspeksiCreate @AsetId, @UserIdPetugas, @Status, @Catatan, @FotoUrl, @FotoBeforeUrl, @FotoAfterUrl, @FormData, @CreatedBy",
                    new
                    {
                        AsetId = asetId,
                        UserIdPetugas = userIdPetugas,
                        Status = status,
                        Catatan = catatan,
                        FotoUrl = fotoUrl,
                        FotoBeforeUrl = fotoBeforeUrl,
                        FotoAfterUrl = fotoAfterUrl,
                        FormData = formData,
                        CreatedBy = actorUsername
                    });
                return rows > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mencatat inspeksi aset. | AsetId: {AsetId}", asetId);
                return false;
            }
        }

        public async Task<IEnumerable<InspeksiHistoryItem>> GetHistoryAsync(string asetId)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.QueryAsync<InspeksiHistoryItem>(
                    "EXEC dbo.ASE_TRX_InspeksiGetHistory @AsetId", new { AsetId = asetId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil riwayat inspeksi. | AsetId: {AsetId}", asetId);
                return [];
            }
        }

        public async Task<IEnumerable<InspeksiHistoryItem>> GetRecentInspeksiAsync(int limit)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.QueryAsync<InspeksiHistoryItem>(
                    "EXEC dbo.ASE_TRX_InspeksiGetRecent @Limit", new { Limit = limit });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil daftar inspeksi terbaru.");
                return [];
            }
        }

        public async Task<bool> CreateAsync(CreateAsetDto dto, string actorUsername)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var rows = await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.ASE_MST_Create @AssetId, @Tipe, @Lokasi, @Detail, @ExpiredDate, @Status, @CreatedBy",
                    new
                    {
                        AssetId = dto.AssetId,
                        Tipe = dto.Tipe,
                        Lokasi = dto.Lokasi,
                        Detail = dto.Detail,
                        ExpiredDate = dto.ExpiredDate,
                        Status = dto.Status,
                        CreatedBy = actorUsername
                    });
                return rows > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal membuat aset baru. | ID: {AssetId}", dto.AssetId);
                return false;
            }
        }

        public async Task<bool> UpdateAsync(string id, UpdateAsetDto dto, string actorUsername)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var rows = await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.ASE_MST_Update @AssetId, @Tipe, @Lokasi, @Detail, @ExpiredDate, @Status, @ModifiedBy",
                    new
                    {
                        AssetId = id,
                        Tipe = dto.Tipe,
                        Lokasi = dto.Lokasi,
                        Detail = dto.Detail,
                        ExpiredDate = dto.ExpiredDate,
                        Status = dto.Status,
                        ModifiedBy = actorUsername
                    });
                return rows > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal memperbarui aset. | ID: {AssetId}", id);
                return false;
            }
        }

        public async Task<bool> DeleteAsync(string id, string actorUsername)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                var rows = await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.ASE_MST_Delete @AssetId, @DeletedBy",
                    new
                    {
                        AssetId = id,
                        DeletedBy = actorUsername
                    });
                return rows > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal menghapus aset. | ID: {AssetId}", id);
                return false;
            }
        }
    }
}
