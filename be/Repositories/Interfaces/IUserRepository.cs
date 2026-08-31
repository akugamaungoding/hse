using TanggapDaruratApi.DTOs.Auth;

namespace TanggapDaruratApi.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<UserAccount?> GetByUsernameAsync(string username);
        Task<UserAccount?> GetByIdAsync(int userId);
        Task<IEnumerable<UserAccount>> GetByRoleCodeAsync(string roleCode);
        Task<int> CountActiveByRoleCodeAsync(string roleCode);
    }
}
