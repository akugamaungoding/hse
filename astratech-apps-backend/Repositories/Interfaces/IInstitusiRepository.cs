using astratech_apps_backend.DTOs.Institusi;
using astratech_apps_backend.DTOs.Institusi.Request;

namespace astratech_apps_backend.Repositories.Interfaces
{
    public interface IInstitusiRepository
    {
        Task<(IEnumerable<Institusi>, int totalData)> GetAllAsync(GetAllInstitusiRequest dto, string username);
        Task<Institusi?> GetByIdAsync(short id, string username);
        Task<int> CreateAsync(CreateInstitusiRequest dto, string username);
        Task<bool> UpdateAsync(UpdateInstitusiRequest dto, string username);
        Task<bool> SetStatusAsync(short id, string username);
    }
}
