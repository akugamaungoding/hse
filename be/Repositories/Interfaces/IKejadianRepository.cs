using TanggapDaruratApi.DTOs.Kejadian;
using TanggapDaruratApi.DTOs.Kejadian.Request;

namespace TanggapDaruratApi.Repositories.Interfaces
{
    public interface IKejadianRepository
    {
        Task<int> CreateAsync(CreateKejadianRequest request, int userId, string kodeKejadian, string createdBy);
        Task<(IEnumerable<Kejadian> Data, int TotalData)> GetAllAsync(GetAllKejadianRequest request);
        Task<Kejadian?> GetByIdAsync(int id);
        Task<Kejadian?> GetAktifAsync();
        Task<bool> SetValidasiAsync(int id, bool hasilValidasi, string? catatan, int userId, string modifiedBy);
        Task<bool> SetStatusAsync(int id, string status, string modifiedBy);
        Task<bool> SetPengumumanDaruratAsync(int id, int userId, string modifiedBy);
        Task<bool> SetPengumumanAmanAsync(int id, string modifiedBy);
        Task<bool> SetDitetapkanAmanAsync(int id, int userId, string modifiedBy);
        Task<bool> ExistsAsync(int id);
    }
}
