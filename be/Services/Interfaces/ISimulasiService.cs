using System.Collections.Generic;
using System.Threading.Tasks;
using TanggapDaruratApi.DTOs.Simulasi;

namespace TanggapDaruratApi.Services.Interfaces
{
    public interface ISimulasiService
    {
        Task<IEnumerable<SimulasiDto>> GetAllAsync();
        Task<int> CreateAsync(SimulasiRequest request, string createdBy);
    }
}
