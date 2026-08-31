namespace TanggapDaruratApi.Helpers
{

    public static class PermissionMap
    {
        private static readonly Dictionary<string, string[]> RolePermissions = new()
        {
            ["CIVITAS"] = new[]
            {
                "kejadian.create", "kejadian.view", "assembly.scan", "notifikasi.view"
            },
            ["TIM_IDENTIFIKASI"] = new[]
            {
                "kejadian.view", "kejadian.validasi", "notifikasi.view"
            },
            ["PIC_CONTROL_ROOM"] = new[]
            {
                "kejadian.view", "kejadian.umumkan", "notifikasi.view"
            },
            ["FLOOR_WARDEN"] = new[]
            {
                "kejadian.view", "evakuasi.view", "evakuasi.update", "notifikasi.view"
            },
            ["PIC_ASSEMBLY_POINT"] = new[]
            {
                "kejadian.view", "assembly.view", "assembly.update", "notifikasi.view"
            },
            ["TIM_P3K"] = new[]
            {
                "kejadian.view", "p3k.view", "p3k.update", "notifikasi.view"
            },
            ["TIM_FIRE_FIGHTER"] = new[]
            {
                "kejadian.view", "pemadaman.view", "pemadaman.update", "notifikasi.view"
            },
            ["KEPALA_KTID"] = new[]
            {
                "kejadian.view", "koordinasi.view", "koordinasi.update",
                "evakuasi.view", "assembly.view", "p3k.view", "pemadaman.view", "notifikasi.view"
            },
            ["UNIT_K3"] = new[]
            {
                "kejadian.view", "laporan.view", "laporan.create",
                "evakuasi.view", "assembly.view", "p3k.view", "pemadaman.view", "koordinasi.view", "notifikasi.view"
            },
            ["GA"] = new[]
            {
                "kejadian.view", "notifikasi.view"
            },
        };

        public static bool HasPermission(string? roleCode, string permission)
        {
            if (string.IsNullOrWhiteSpace(roleCode)) return false;
            return RolePermissions.TryGetValue(roleCode, out var perms) && perms.Contains(permission);
        }
    }
}
