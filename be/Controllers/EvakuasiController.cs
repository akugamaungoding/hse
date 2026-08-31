using TanggapDaruratApi.DTOs.Evakuasi.Request;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TanggapDaruratApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EvakuasiController(IEvakuasiService service) : ControllerBase
    {
        private readonly IEvakuasiService _service = service;

        [HttpGet("kejadian/{kejadianId}")]
        [RequiresPermission("evakuasi.view")]
        public async Task<IActionResult> GetByKejadian(int kejadianId)
        {
            var data = await _service.GetByKejadianAsync(kejadianId);
            return Ok(data);
        }

        [HttpPost("{id}/instruksi")]
        [RequiresPermission("evakuasi.update")]
        public async Task<IActionResult> Instruksi(int id)
        {
            var userId = User.GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { message = "Sesi tidak valid." });

            var (success, message) = await _service.InstruksiAsync(id, userId, User.GetCurrentUsername());
            if (!success) return BadRequest(new { message });

            return Ok(new { message });
        }

        [HttpPost("{id}/selesai")]
        [RequiresPermission("evakuasi.update")]
        public async Task<IActionResult> Selesai(int id, [FromBody] SelesaiEvakuasiRequest dto)
        {
            var userId = User.GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { message = "Sesi tidak valid." });

            var (success, message) = await _service.SelesaiAsync(id, userId, dto.Catatan, User.GetCurrentUsername());
            if (!success) return BadRequest(new { message });

            return Ok(new { message });
        }
    }
}
