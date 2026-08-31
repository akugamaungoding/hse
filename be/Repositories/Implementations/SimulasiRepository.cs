using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TanggapDaruratApi.DTOs.Simulasi;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Repositories.Interfaces;

namespace TanggapDaruratApi.Repositories.Implementations
{
    public class SimulasiRepository(DatabaseConfig dbConfig, ILogger<SimulasiRepository> logger) : ISimulasiRepository
    {
        private readonly string _conn = dbConfig.ConnectionString;
        private readonly ILogger<SimulasiRepository> _logger = logger;

        public async Task<IEnumerable<SimulasiDto>> GetAllAsync()
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.QueryAsync<SimulasiDto>("EXEC dbo.SIM_TRX_GetAll");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengambil daftar simulasi.");
                return [];
            }
        }

        public async Task<int> CreateAsync(SimulasiRequest request, string createdBy)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);
                return await conn.ExecuteScalarAsync<int>(
                    "EXEC dbo.SIM_TRX_Create @Nama, @Tanggal, @Deskripsi, @PesertaCount, @Evaluasi, @CreatedBy",
                    new
                    {
                        request.Nama,
                        request.Tanggal,
                        request.Deskripsi,
                        request.PesertaCount,
                        request.Evaluasi,
                        CreatedBy = createdBy
                    });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mencatat simulasi baru. | Nama: {Nama}", request.Nama);
                return 0;
            }
        }
    }
}
