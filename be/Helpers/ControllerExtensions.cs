using System.Security.Claims;

namespace TanggapDaruratApi.Helpers
{
    public static class ControllerExtensions
    {
        public static int GetCurrentUserId(this ClaimsPrincipal user)
        {
            var claim = user.FindFirstValue("userid");
            return int.TryParse(claim, out var id) ? id : 0;
        }

        public static string? GetCurrentRoleCode(this ClaimsPrincipal user) => user.FindFirstValue("idrole");
        public static string GetCurrentUsername(this ClaimsPrincipal user) => user.FindFirstValue("namaakun") ?? "SYSTEM";
    }
}
