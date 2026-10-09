using astratech_apps_backend.Services.Interfaces;
using System.DirectoryServices.Protocols;
using System.Net;
using System.Text;

namespace astratech_apps_backend.Services.Implementations
{
    public class LdapService(IConfiguration configuration, ILogger<LdapService> logger) : ILdapService
    {
        private readonly string _ldapServer = configuration["Key:LDAPServer"]!;
        private readonly string _ldapDN = configuration["Key:LDAPDN"]!;
        private readonly ILogger<LdapService> _logger = logger;

        public async Task<(bool IsSuccess, string? ErrorMessage)> AuthenticateAsync(string username, string password)
        {
            return await Task.Run(() =>
            {
                try
                {
                    using var connection = new LdapConnection(_ldapServer);
                    connection.AuthType = AuthType.Basic;
                    connection.SessionOptions.ReferralChasing = ReferralChasingOptions.None;
                    connection.Bind(new NetworkCredential($"polman\\{username}", password));
                    return (true, "");
                }
                catch (LdapException ex)
                {
                    if (ex.ErrorCode == 49) return (false, "Username atau password tidak valid.");

                    _logger.LogError(ex, "Koneksi ke server LDAP gagal. | [{Username}]", username);
                    return (false, "Koneksi ke server LDAP gagal.");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Terjadi kesalahan pada proses autentikasi. | [{Username}]", username);
                    return (false, "Terjadi kesalahan pada proses autentikasi.");
                }
            });
        }

        private async Task<string?> GetAttributeAsync(string samAccountName, string attributeName)
        {
            return await Task.Run(() =>
            {
                try
                {
                    using var connection = new LdapConnection(_ldapServer);
                    connection.AuthType = AuthType.Basic;
                    connection.SessionOptions.ReferralChasing = ReferralChasingOptions.None;
                    connection.Bind(new NetworkCredential($"polman\\{configuration["Key:LDAPSSOManagerUsername"]!}", configuration["Key:LDAPSSOManagerPassword"]!));

                    string filter = $"(sAMAccountName={samAccountName})";

                    var searchRequest = new SearchRequest(
                        _ldapDN,
                        filter,
                        SearchScope.Subtree,
                        attributeName
                    )
                    { SizeLimit = 1 };

                    var searchResponse = (SearchResponse)connection.SendRequest(searchRequest);

                    if (searchResponse.Entries.Count > 0)
                    {
                        var entry = searchResponse.Entries[0];
                        if (entry.Attributes.Contains(attributeName))
                        {
                            var attribute = entry.Attributes[attributeName];
                            return Encoding.UTF8.GetString((byte[])attribute.GetValues(typeof(byte[]))[0]);
                        }
                    }
                    return null;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Gagal mendapatkan atribut {AttributeName}. | [{Username}]", attributeName, samAccountName);
                    return samAccountName;
                }
            });
        }

        public Task<string?> GetUsernameAsync(string samAccountName)
        {
            return GetAttributeAsync(samAccountName, "sAMAccountName");
        }

        public Task<string?> GetMailAsync(string samAccountName)
        {
            return GetAttributeAsync(samAccountName, "mail");
        }

        public Task<string?> GetDisplayNameAsync(string samAccountName)
        {
            return GetAttributeAsync(samAccountName, "displayName");
        }
    }
}
