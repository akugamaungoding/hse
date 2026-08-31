using TanggapDaruratApi.DTOs.P3K.Request;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TanggapDaruratApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class P3KController(IP3KService service) : ControllerBase
    {
        private readonly IP3KService _service = service;

        [HttpGet("kejadian/{kejadianId}")]
        [RequiresPermission("p3k.view")]
        public async Task<IActionResult> Get(int kejadianId)
        {
            var data = await _service.GetAsync(kejadianId);
            if (data == null) return NotFound(new { message = "Belum ada laporan P3K untuk kejadian ini." });

            return Ok(data);
        }

        [HttpPost("kejadian/{kejadianId}")]
        [RequiresPermission("p3k.update")]
        public async Task<IActionResult> Upsert(int kejadianId, [FromBody] UpsertP3KRequest dto)
        {
            var userId = User.GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { message = "Sesi tidak valid." });

            var (success, message) = await _service.UpsertAsync(
                kejadianId, dto.AdaKorban, dto.JumlahKorban, dto.KondisiKorban, dto.Tindakan, dto.PerluAmbulans, userId, User.GetCurrentUsername());

            if (!success) return BadRequest(new { message });

            return Ok(new { message });
        }
    }
}
