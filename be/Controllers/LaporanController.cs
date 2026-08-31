using TanggapDaruratApi.DTOs.Laporan.Request;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TanggapDaruratApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LaporanController(ILaporanService service) : ControllerBase
    {
        private readonly ILaporanService _service = service;

        [HttpGet]
        [RequiresPermission("laporan.view")]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
        {
            var data = await _service.GetAllReportedAsync(pageNumber, pageSize);
            return Ok(data);
        }

        [HttpGet("kejadian/{kejadianId}")]
        [RequiresPermission("laporan.view")]
        public async Task<IActionResult> Get(int kejadianId)
        {
            var data = await _service.GetAsync(kejadianId);
            if (data == null) return NotFound(new { message = "Belum ada laporan untuk kejadian ini." });

            return Ok(data);
        }

        [HttpPost("kejadian/{kejadianId}")]
        [RequiresPermission("laporan.create")]
        public async Task<IActionResult> Create(int kejadianId, [FromBody] CreateLaporanRequest dto)
        {
            var userId = User.GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { message = "Sesi tidak valid." });

            var (success, message) = await _service.CreateAsync(kejadianId, dto.Ringkasan, dto.TindakLanjut, userId, User.GetCurrentUsername());
            if (!success) return BadRequest(new { message });

            return Ok(new { message });
        }
    }
}
