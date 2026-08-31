using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TanggapDaruratApi.DTOs.Simulasi;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Services.Interfaces;

namespace TanggapDaruratApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SimulasiController(ISimulasiService service) : ControllerBase
    {
        private readonly ISimulasiService _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllAsync();
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SimulasiRequest request)
        {
            var userId = User.GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { message = "Sesi tidak valid." });

            var simulasiId = await _service.CreateAsync(request, User.GetCurrentUsername());
            if (simulasiId == 0) return BadRequest(new { message = "Gagal menyimpan rekap simulasi." });

            return Ok(new { message = "Rekap simulasi berhasil disimpan.", simulasiId });
        }
    }
}
