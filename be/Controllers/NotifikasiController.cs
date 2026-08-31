using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TanggapDaruratApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotifikasiController(INotifikasiService service) : ControllerBase
    {
        private readonly INotifikasiService _service = service;

        [HttpGet]
        [RequiresPermission("notifikasi.view")]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
        {
            var userId = User.GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { message = "Sesi tidak valid." });

            var data = await _service.GetAllAsync(userId, pageNumber, pageSize);
            return Ok(data);
        }

        [HttpGet("unread-count")]
        [RequiresPermission("notifikasi.view")]
        public async Task<IActionResult> UnreadCount()
        {
            var userId = User.GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { message = "Sesi tidak valid." });

            var count = await _service.GetUnreadCountAsync(userId);
            return Ok(new { totalUnread = count });
        }

        [HttpPatch("{id}/read")]
        [RequiresPermission("notifikasi.view")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var userId = User.GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { message = "Sesi tidak valid." });

            var (success, message) = await _service.MarkAsReadAsync(id, userId, User.GetCurrentUsername());
            if (!success) return NotFound(new { message });

            return Ok(new { message });
        }
    }
}
