using TanggapDaruratApi.DTOs.Kejadian.Request;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TanggapDaruratApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class KejadianController(IKejadianService service) : ControllerBase
    {
        private readonly IKejadianService _service = service;

        private const string UserIdInvalidMessage = "Sesi tidak valid.";
        private const string NotFoundMessage = "Kejadian tidak ditemukan.";

        [HttpPost("alert")]
        [RequiresPermission("kejadian.create")]
        public async Task<IActionResult> Alert([FromBody] CreateKejadianRequest dto)
        {
            var userId = User.GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { message = UserIdInvalidMessage });

            var res = await _service.CreateAlertAsync(dto, userId, User.GetCurrentUsername());
            if (res.KejadianId == 0) return BadRequest(new { message = res.Message });

            return Ok(res);
        }

        [HttpGet]
        [RequiresPermission("kejadian.view")]
        public async Task<IActionResult> GetAll([FromQuery] GetAllKejadianRequest dto)
        {
            var res = await _service.GetAllAsync(dto);
            return Ok(res);
        }

        [HttpGet("aktif")]
        [RequiresPermission("kejadian.view")]
        public async Task<IActionResult> GetAktif()
        {
            var res = await _service.GetAktifAsync();
            return Ok(res);
        }

        [HttpGet("{id}/status")]
        [RequiresPermission("kejadian.view")]
        public async Task<IActionResult> GetStatus(int id)
        {
            var res = await _service.GetStatusAsync(id);
            if (res == null) return NotFound(new { message = NotFoundMessage });

            return Ok(res);
        }

        [HttpPost("{id}/validasi")]
        [RequiresPermission("kejadian.validasi")]
        public async Task<IActionResult> Validasi(int id, [FromBody] ValidasiKejadianRequest dto)
        {
            var userId = User.GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { message = UserIdInvalidMessage });

            var (success, message) = await _service.ValidasiAsync(id, dto, userId, User.GetCurrentUsername());
            if (!success) return BadRequest(new { message });

            return Ok(new { message });
        }

        [HttpPost("{id}/pengumuman-darurat")]
        [RequiresPermission("kejadian.umumkan")]
        public async Task<IActionResult> PengumumanDarurat(int id)
        {
            var userId = User.GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { message = UserIdInvalidMessage });

            var (success, message) = await _service.PengumumanDaruratAsync(id, userId, User.GetCurrentUsername());
            if (!success) return BadRequest(new { message });

            return Ok(new { message });
        }

        [HttpPost("{id}/pengumuman-aman")]
        [RequiresPermission("kejadian.umumkan")]
        public async Task<IActionResult> PengumumanAman(int id)
        {
            var (success, message) = await _service.PengumumanAmanAsync(id, User.GetCurrentUsername());
            if (!success) return BadRequest(new { message });

            return Ok(new { message });
        }
    }
}
