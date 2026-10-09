using astratech_apps_backend.DTOs.Auth.Request;
using astratech_apps_backend.DTOs.Auth.Response;
using astratech_apps_backend.Helpers;
using astratech_apps_backend.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace astratech_apps_backend.Services.Implementations
{
    public class AuthService(IConfiguration config, ILdapService ldapService, IUserService userService, ILogger<AuthService> logger) : IAuthService
    {
        private readonly IConfiguration _config = config;
        private readonly ILdapService _ldapService = ldapService;
        private readonly IUserService _userService = userService;
        private readonly ILogger<AuthService> _logger = logger;

        public async Task<LoginResponse?> AuthenticateAsync(LoginRequest dto, string currentIssuer)
        {
            try
            {
                bool isLdapBypass = _config["Key:LDAPIsBypass"] == "1";

                if (isLdapBypass)
                {
                    _logger.LogWarning("LDAP Bypass AKTIF. Validasi kredensial dilewati untuk user: {Username}.", dto.Username);
                }
                else
                {
                    var (IsLDAPSuccess, ErrorLDAPMessage) = await _ldapService.AuthenticateAsync(dto.Username, dto.Password);
                    if (!IsLDAPSuccess) return new LoginResponse { ErrorMessage = ErrorLDAPMessage! };
                }

                var (IsUserSuccess, ListAplikasi, ErrorUserMessage) = await _userService.AuthenticateAsync(dto.Username, dto.JenisAplikasi);
                if (!IsUserSuccess) return new LoginResponse { ErrorMessage = ErrorUserMessage! };

                var allowedIssuers = _config.GetSection("Key:jwtIssuer").Get<List<string>>() ?? [];
                if (!allowedIssuers.Contains(currentIssuer))
                {
                    return new LoginResponse { ErrorMessage = "Domain tidak diizinkan." };
                }

                var claims = new List<Claim>
                {
                    new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new("namaakun", dto.Username)
                };

                var (token, expiresAt) = GenerateJwtToken(claims, currentIssuer);
                var nama = isLdapBypass ? dto.Username : await _ldapService.GetDisplayNameAsync(dto.Username) ?? dto.Username;

                return new LoginResponse
                {
                    Token = token,
                    Nama = nama,
                    ListAplikasi = ListAplikasi,
                    ExpiresAt = expiresAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Terjadi kesalahan pada proses autentikasi. | [{Username}]", dto.Username);
                return null;
            }
        }

        public async Task<PermissionResponse?> GetPermissionAsync(PermissionRequest dto, string currentIssuer)
        {
            try
            {
                var (IsSuccess, ListPermission, ErrorMessage) = await _userService.GetPermissionAsync(dto.Username, dto.AppId, dto.RoleId);
                if (!IsSuccess) return new PermissionResponse { ErrorMessage = ErrorMessage! };

                var allowedIssuers = _config.GetSection("Key:jwtIssuer").Get<List<string>>() ?? [];
                if (!allowedIssuers.Contains(currentIssuer))
                {
                    return new PermissionResponse { ErrorMessage = "Domain tidak diizinkan." };
                }

                var claims = new List<Claim>
                {
                    new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new("namaakun", dto.Username),
                    new("idrole", dto.RoleId),
                    new("idapp", dto.AppId)
                };

                var (token, expiresAt) = GenerateJwtToken(claims, currentIssuer);

                return new PermissionResponse
                {
                    Token = token,
                    ListPermission = ListPermission,
                    ExpiresAt = expiresAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mendapatkan daftar hak akses. | [{Username}]", dto.Username);
                return null;
            }
        }

        public async Task<MenuResponse?> GetMenuAsync(PermissionRequest dto)
        {
            try
            {
                var (IsSuccess, ListMenu, ErrorMessage) = await _userService.GetListMenuAsync(dto.Username, dto.AppId, dto.RoleId);
                if (!IsSuccess) return new MenuResponse { ErrorMessage = ErrorMessage! };

                return new MenuResponse { ListMenu = ListMenu };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mendapatkan daftar menu. | [{Username}]", dto.Username);
                return null;
            }
        }

        private (string Token, DateTime ExpiresAt) GenerateJwtToken(IEnumerable<Claim> claims, string issuer)
        {
            var key = Environment.GetEnvironmentVariable("DECRYPT_KEY_JWT")!;
            var audience = _config["Key:jwtAudience"]!;
            var minutes = int.Parse(_config["Key:jwtLifeTime"] ?? "480");
            var expiresAt = DateTime.UtcNow.AddMinutes(minutes);
            var token = JwtHelper.GenerateToken(key, issuer, audience, TimeSpan.FromMinutes(minutes), claims);

            return (token, expiresAt);
        }
    }
}
