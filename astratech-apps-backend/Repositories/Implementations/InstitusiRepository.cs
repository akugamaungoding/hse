using astratech_apps_backend.DTOs.Institusi;
using astratech_apps_backend.DTOs.Institusi.Request;
using astratech_apps_backend.Helpers;
using astratech_apps_backend.Repositories.Interfaces;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace astratech_apps_backend.Repositories.Implementations
{
    public class InstitusiRepository(DatabaseConfig dbConfig, ILogger<InstitusiRepository> logger) : IInstitusiRepository
    {
        private readonly string _conn = dbConfig.ConnectionStringSIA;
        private readonly ILogger<InstitusiRepository> _logger = logger;

        public async Task<int> CreateAsync(CreateInstitusiRequest dto, string username)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);

                var parameters = new DynamicParameters(dto);
                parameters.Add("@CreatedBy", username);
                var newId = await conn.ExecuteScalarAsync<int>("INS_MST_Create", parameters, commandType: CommandType.StoredProcedure);

                return newId;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal menambahkan institusi baru. | [{Username}]", username);
                return 0;
            }
        }

        public async Task<(IEnumerable<Institusi>, int totalData)> GetAllAsync(GetAllInstitusiRequest dto, string username)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);

                var parameters = new
                {
                    Keyword = dto.SearchKeyword,
                    dto.Status,
                    dto.Urut,
                    Halaman = dto.PageNumber,
                    Limit = dto.PageSize
                };
                var result = await conn.QueryAsync<dynamic>("INS_MST_GetData", parameters, commandType: CommandType.StoredProcedure);

                var list = new List<Institusi>();
                int totalData = 0;

                if (result.Any())
                {
                    totalData = (int)result.First().Count;

                    list = [.. result.Select(row => new Institusi
                    {
                        Id = (short)row.ins_id,
                        RowNumber = (long)row.rownum,
                        NamaInstitusi = (string)row.ins_nama,
                        NamaDirektur = (string)row.ins_direktur,
                        TanggalSK = (DateTime)row.ins_tgl_sk,
                        NomorSK = (string)row.ins_no_sk,
                        Status = (string)row.ins_status
                    })];
                }

                return (list, totalData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mendapatkan data institusi. | [{Username}]", username);
                return ([], 0);
            }
        }

        public async Task<Institusi?> GetByIdAsync(short id, string username)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);

                var row = await conn.QueryFirstOrDefaultAsync<dynamic>("INS_MST_Detail", new { Id = id }, commandType: CommandType.StoredProcedure);
                if (row == null) return null;

                return new Institusi
                {
                    NamaInstitusi = (string)row.ins_nama,
                    NamaDirektur = (string)row.ins_direktur,
                    NamaWadir1 = (string)row.ins_wadir1,
                    NamaWadir2 = (string)row.ins_wadir2,
                    NamaWadir3 = (string)row.ins_wadir3,
                    NamaWadir4 = (string)row.ins_wadir4,
                    Alamat = (string)row.ins_alamat,
                    KodePos = (string)row.ins_kodepos,
                    Telepon = (string)row.ins_telepon,
                    Fax = (string)row.ins_fax,
                    Email = (string)row.ins_email,
                    Website = (string)row.ins_website,
                    TanggalBerdiri = (DateTime)row.ins_tgl_berdiri,
                    NomorSK = (string)row.ins_no_sk,
                    TanggalSK = (DateTime)row.ins_tgl_sk,
                    Status = (string)row.ins_status
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mendapatkan data institusi. | [{Username}]", username);
                return null;
            }
        }

        public async Task<bool> SetStatusAsync(short id, string username)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);

                var parameters = new
                {
                    Id = id,
                    UpdatedBy = username
                };
                await conn.ExecuteAsync("INS_MST_SetStatus", parameters, commandType: CommandType.StoredProcedure);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal menyimpan data institusi. | [{Username}]", username);
                return false;
            }
        }

        public async Task<bool> UpdateAsync(UpdateInstitusiRequest dto, string username)
        {
            try
            {
                await using var conn = new SqlConnection(_conn);

                var parameters = new DynamicParameters(dto);
                parameters.Add("@UpdatedBy", username);
                await conn.ExecuteAsync("INS_MST_Edit", parameters, commandType: CommandType.StoredProcedure);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal menyimpan data institusi. | [{Username}]", username);
                return false;
            }
        }
    }
}
