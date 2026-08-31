using TanggapDaruratApi.DTOs.AssemblyPoint.Request;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TanggapDaruratApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AssemblyPointController(IAssemblyPointService service) : ControllerBase
    {
        private readonly IAssemblyPointService _service = service;

        [HttpPost("scan")]
        [RequiresPermission("assembly.scan")]
        public async Task<IActionResult> Scan([FromBody] ScanAssemblyRequest dto)
        {
            var userId = User.GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { message = "Sesi tidak valid." });

            var (success, message) = await _service.ScanAsync(dto.KejadianId, userId, dto.KodeAssemblyPoint, User.GetCurrentUsername());
            if (!success) return BadRequest(new { message });

            return Ok(new { message });
        }

        [HttpGet("kejadian/{kejadianId}/rekap")]
        [RequiresPermission("assembly.view")]
        public async Task<IActionResult> GetRekap(int kejadianId)
        {
            var data = await _service.GetRekapAsync(kejadianId);
            return Ok(data);
        }

        [HttpGet("kejadian/{kejadianId}/list")]
        [RequiresPermission("assembly.view")]
        public async Task<IActionResult> GetList(int kejadianId)
        {
            var data = await _service.GetListAsync(kejadianId);
            return Ok(data);
        }

        [HttpPost("kejadian/{kejadianId}/konfirmasi-lengkap")]
        [RequiresPermission("assembly.update")]
        public async Task<IActionResult> KonfirmasiLengkap(int kejadianId)
        {
            var userId = User.GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { message = "Sesi tidak valid." });

            var (success, message) = await _service.KonfirmasiLengkapAsync(kejadianId, userId, User.GetCurrentUsername());
            if (!success) return BadRequest(new { message });

            return Ok(new { message });
        }
    }
}
