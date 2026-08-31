using System.Collections.Generic;
using System.Threading.Tasks;
using TanggapDaruratApi.DTOs.Simulasi;

namespace TanggapDaruratApi.Repositories.Interfaces
{
    public interface ISimulasiRepository
    {
        Task<IEnumerable<SimulasiDto>> GetAllAsync();
        Task<int> CreateAsync(SimulasiRequest request, string createdBy);
    }
}
