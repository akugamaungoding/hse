using TanggapDaruratApi.DTOs.Pemadaman.Request;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TanggapDaruratApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PemadamanController(IPemadamanService service) : ControllerBase
    {
        private readonly IPemadamanService _service = service;

        [HttpGet("kejadian/{kejadianId}")]
        [RequiresPermission("pemadaman.view")]
        public async Task<IActionResult> Get(int kejadianId)
        {
            var data = await _service.GetAsync(kejadianId);
            if (data == null) return NotFound(new { message = "Belum ada laporan pemadaman untuk kejadian ini." });

            return Ok(data);
        }

        [HttpPost("kejadian/{kejadianId}")]
        [RequiresPermission("pemadaman.update")]
        public async Task<IActionResult> Upsert(int kejadianId, [FromBody] UpsertPemadamanRequest dto)
        {
            var userId = User.GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { message = "Sesi tidak valid." });

            var (success, message) = await _service.UpsertAsync(kejadianId, dto.SumberApi, dto.PerluDamkar, dto.HasilPemadaman, userId, User.GetCurrentUsername());
            if (!success) return BadRequest(new { message });

            return Ok(new { message });
        }
    }
}
