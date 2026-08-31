using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TanggapDaruratApi.DTOs.Auth.Request;
using TanggapDaruratApi.DTOs.Auth.Response;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Repositories.Interfaces;
using TanggapDaruratApi.Services.Interfaces;

namespace TanggapDaruratApi.Services.Implementations
{
    public class AuthService(IConfiguration config, IUserRepository userRepository, ILogger<AuthService> logger) : IAuthService
    {
        private readonly IConfiguration _config = config;
        private readonly IUserRepository _userRepository = userRepository;
        private readonly ILogger<AuthService> _logger = logger;

        public async Task<LoginResponse> AuthenticateAsync(LoginRequest dto, string currentIssuer)
        {
            try
            {
                var user = await _userRepository.GetByUsernameAsync(dto.Username);
                
                if (user == null)
                    return new LoginResponse { ErrorMessage = "Nama pengguna atau kata sandi salah." };

                if (!PasswordHelper.VerifyPassword(dto.Password, user.PasswordHash))
                    return new LoginResponse { ErrorMessage = "Nama pengguna atau kata sandi salah." };

                return new LoginResponse
                {
                    Token = "MOCK_TOKEN",
                    UserId = user.UserId,
                    Username = user.Username,
                    Nama = user.Nama,
                    RoleCode = user.RoleCode,
                    RoleName = user.RoleName,
                    Email = user.Email,
                    NoHp = user.NoHp,
                    ExpiresAt = DateTime.UtcNow.AddDays(7)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Terjadi kesalahan pada proses autentikasi. | [{Username}]", dto.Username);
                return new LoginResponse { ErrorMessage = "Terjadi kesalahan pada server." };
            }
        }

        public async Task<CurrentUserResponse?> GetCurrentUserAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return null;

            return new CurrentUserResponse
            {
                UserId = user.UserId,
                Username = user.Username,
                Nama = user.Nama,
                Email = user.Email,
                NoHp = user.NoHp,
                RoleCode = user.RoleCode,
                RoleName = user.RoleName
            };
        }

        public async Task<IEnumerable<CurrentUserResponse>> GetUsersByRoleAsync(string roleCode)
        {
            var users = await _userRepository.GetByRoleCodeAsync(roleCode);
            return users.Select(user => new CurrentUserResponse
            {
                UserId = user.UserId,
                Username = user.Username,
                Nama = user.Nama,
                Email = user.Email,
                NoHp = user.NoHp,
                RoleCode = user.RoleCode,
                RoleName = user.RoleName
            });
        }
    }
}
