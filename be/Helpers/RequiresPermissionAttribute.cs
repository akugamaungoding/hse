using Microsoft.AspNetCore.Authorization;

namespace TanggapDaruratApi.Helpers
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
    public class RequiresPermissionAttribute : AuthorizeAttribute
    {
        public string[] Permissions { get; }

        public RequiresPermissionAttribute(params string[] permissions)
        {
            Permissions = permissions;
            Policy = "HasPermission";
        }
    }
}
