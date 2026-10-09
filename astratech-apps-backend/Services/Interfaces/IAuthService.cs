using astratech_apps_backend.DTOs.Auth.Request;
using astratech_apps_backend.DTOs.Auth.Response;

namespace astratech_apps_backend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponse?> AuthenticateAsync(LoginRequest dto, string currentIssuer);
        Task<PermissionResponse?> GetPermissionAsync(PermissionRequest dto, string currentIssuer);
        Task<MenuResponse?> GetMenuAsync(PermissionRequest dto);
    }
}
