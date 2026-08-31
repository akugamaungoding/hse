using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TanggapDaruratApi.DTOs.Aset;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Services.Interfaces;

namespace TanggapDaruratApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AsetController(IAsetService service) : ControllerBase
    {
        private readonly IAsetService _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? tipe, [FromQuery] string? status)
        {
            var data = await _service.GetAllAsync(tipe, status);
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var data = await _service.GetByIdAsync(id);
            if (data == null) return NotFound(new { message = "Aset tidak ditemukan." });
            return Ok(data);
        }

        [HttpPost("{id}/inspeksi")]
        public async Task<IActionResult> SubmitInspeksi(string id, [FromBody] InspeksiRequest request)
        {
            var userId = User.GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { message = "Sesi tidak valid." });

            var success = await _service.SubmitInspeksiAsync(id, userId, request, User.GetCurrentUsername());
            if (!success) return BadRequest(new { message = "Gagal mengirimkan laporan inspeksi." });

            return Ok(new { message = "Laporan inspeksi berhasil disimpan." });
        }

        [HttpGet("{id}/riwayat")]
        public async Task<IActionResult> GetHistory(string id)
        {
            var data = await _service.GetHistoryAsync(id);
            return Ok(data);
        }

        [HttpGet("recent-inspeksi")]
        public async Task<IActionResult> GetRecentInspeksi([FromQuery] int limit = 5)
        {
            var data = await _service.GetRecentInspeksiAsync(limit);
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAsetDto request)
        {
            var success = await _service.CreateAsync(request, User.GetCurrentUsername());
            if (!success) return BadRequest(new { message = "Gagal membuat data aset. Kode Aset mungkin sudah ada." });
            return Ok(new { message = "Aset baru berhasil ditambahkan." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateAsetDto request)
        {
            var success = await _service.UpdateAsync(id, request, User.GetCurrentUsername());
            if (!success) return BadRequest(new { message = "Gagal meng-update data aset." });
            return Ok(new { message = "Data aset berhasil diperbarui." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var success = await _service.DeleteAsync(id, User.GetCurrentUsername());
            if (!success) return BadRequest(new { message = "Gagal menghapus data aset." });
            return Ok(new { message = "Data aset berhasil dihapus." });
        }
    }
}
