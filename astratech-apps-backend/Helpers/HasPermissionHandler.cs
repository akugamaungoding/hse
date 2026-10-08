using astratech_apps_backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace astratech_apps_backend.Helpers
{
    public class HasPermissionHandler(IUserService userService) : AuthorizationHandler<HasPermissionRequirement>
    {
        private readonly IUserService _userService = userService;

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, HasPermissionRequirement requirement)
        {
            var endpoint = context.Resource as Endpoint ?? (context.Resource as HttpContext)?.GetEndpoint();

            if (endpoint == null)
            {
                context.Fail();
                return;
            }

            var permissionAttribute = endpoint.Metadata.GetMetadata<RequiresPermissionAttribute>();

            if (permissionAttribute == null)
            {
                return;
            }

            var roleId = context.User.FindFirstValue("idrole");
            var appId = context.User.FindFirstValue("idapp");
            var username = context.User.FindFirstValue("namaakun");

            if (string.IsNullOrEmpty(roleId) || string.IsNullOrEmpty(appId) || string.IsNullOrEmpty(username))
            {
                context.Fail();
                return;
            }

            bool hasAccess = false;

            foreach (var permission in permissionAttribute.Permissions)
            {
                bool hasPermission = await _userService.HasPermissionAsync(username, appId, roleId, permission);
                if (hasPermission)
                {
                    hasAccess = true;
                    break;
                }
            }

            if (hasAccess)
            {
                context.Succeed(requirement);
            }
            else
            {
                context.Fail();
            }
        }
    }
}
