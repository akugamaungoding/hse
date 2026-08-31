using TanggapDaruratApi.DTOs.Auth.Request;
using TanggapDaruratApi.DTOs.Auth.Response;

namespace TanggapDaruratApi.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponse> AuthenticateAsync(LoginRequest dto, string currentIssuer);
        Task<CurrentUserResponse?> GetCurrentUserAsync(int userId);
        Task<IEnumerable<CurrentUserResponse>> GetUsersByRoleAsync(string roleCode);
    }
}
