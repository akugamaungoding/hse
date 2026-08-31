using System.Security.Claims;
using TanggapDaruratApi.DTOs.Auth.Request;
using TanggapDaruratApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TanggapDaruratApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService auth) : ControllerBase
    {
        private readonly IAuthService _auth = auth;

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest dto)
        {
            var currentIssuer = $"{Request.Scheme}://{Request.Host.Value}";
            var res = await _auth.AuthenticateAsync(dto, currentIssuer);

            if (string.IsNullOrEmpty(res.Token))
                return Unauthorized(new { message = res.ErrorMessage });

            return Ok(res);
        }

        [HttpGet("users-by-role/{roleCode}")]
        public async Task<IActionResult> GetUsersByRole(string roleCode)
        {
            var res = await _auth.GetUsersByRoleAsync(roleCode);
            return Ok(res);
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userIdClaim = User.FindFirstValue("userid");
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "Sesi tidak valid." });

            var res = await _auth.GetCurrentUserAsync(userId);
            if (res == null) return NotFound(new { message = "User tidak ditemukan." });

            return Ok(res);
        }
    }
}
