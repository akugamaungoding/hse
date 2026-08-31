using System.Collections.Generic;
using System.Threading.Tasks;
using TanggapDaruratApi.DTOs.Simulasi;
using TanggapDaruratApi.Repositories.Interfaces;
using TanggapDaruratApi.Services.Interfaces;

namespace TanggapDaruratApi.Services.Implementations
{
    public class SimulasiService(ISimulasiRepository repo) : ISimulasiService
    {
        private readonly ISimulasiRepository _repo = repo;

        public Task<IEnumerable<SimulasiDto>> GetAllAsync()
            => _repo.GetAllAsync();

        public Task<int> CreateAsync(SimulasiRequest request, string createdBy)
            => _repo.CreateAsync(request, createdBy);
    }
}
