using astratech_apps_backend.DTOs.Auth.Request;
using astratech_apps_backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace astratech_apps_backend.Controllers
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

            if (res?.Token == null) return Unauthorized(new { message = res?.ErrorMessage });
            if (!string.IsNullOrEmpty(res?.ErrorMessage)) return BadRequest(new { message = res?.ErrorMessage });
            return Ok(res);
        }

        [Authorize]
        [HttpPost("getpermission")]
        public async Task<IActionResult> GetPermission([FromBody] PermissionRequest dto)
        {
            var currentIssuer = $"{Request.Scheme}://{Request.Host.Value}";
            var res = await _auth.GetPermissionAsync(dto, currentIssuer);

            if (res?.Token == null) return Unauthorized(new { message = res?.ErrorMessage });
            if (!string.IsNullOrEmpty(res?.ErrorMessage)) return BadRequest(new { message = res?.ErrorMessage });
            return Ok(res);
        }

        [Authorize]
        [HttpPost("getmenu")]
        public async Task<IActionResult> GetMenu([FromBody] PermissionRequest dto)
        {
            var username = User.FindFirstValue("namaakun");
            var appId = User.FindFirstValue("idapp");
            var roleId = User.FindFirstValue("idrole");

            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(appId) || string.IsNullOrEmpty(roleId))
            {
                return Unauthorized();
            }

            if (dto == null) return NotFound();

            var res = await _auth.GetMenuAsync(dto);
            if (!string.IsNullOrEmpty(res?.ErrorMessage)) return BadRequest(new { message = res?.ErrorMessage });
            return Ok(res);
        }
    }
}
