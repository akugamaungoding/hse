using TanggapDaruratApi.DTOs.Koordinasi.Request;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TanggapDaruratApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class KoordinasiController(IKoordinasiService service) : ControllerBase
    {
        private readonly IKoordinasiService _service = service;

        [HttpGet("kejadian/{kejadianId}")]
        [RequiresPermission("koordinasi.view")]
        public async Task<IActionResult> GetHistory(int kejadianId)
        {
            var data = await _service.GetHistoryAsync(kejadianId);
            return Ok(data);
        }

        [HttpPost("kejadian/{kejadianId}/update")]
        [RequiresPermission("koordinasi.update")]
        public async Task<IActionResult> Update(int kejadianId, [FromBody] UpdateKoordinasiRequest dto)
        {
            var userId = User.GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { message = "Sesi tidak valid." });

            var (success, message) = await _service.AddUpdateAsync(kejadianId, dto.Catatan, userId, User.GetCurrentUsername());
            if (!success) return BadRequest(new { message });

            return Ok(new { message });
        }

        [HttpPost("kejadian/{kejadianId}/tetapkan-aman")]
        [RequiresPermission("koordinasi.update")]
        public async Task<IActionResult> TetapkanAman(int kejadianId)
        {
            var userId = User.GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { message = "Sesi tidak valid." });

            var (success, message) = await _service.TetapkanAmanAsync(kejadianId, userId, User.GetCurrentUsername());
            if (!success) return BadRequest(new { message });

            return Ok(new { message });
        }
    }
}
