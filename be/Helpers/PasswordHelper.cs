using Isopoh.Cryptography.Argon2;
using System.Security.Cryptography;
using System.Text;

namespace TanggapDaruratApi.Helpers
{
    public static class PasswordHelper
    {
        public static string HashPassword(string password)
        {
            var config = new Argon2Config
            {
                Type = Argon2Type.DataIndependentAddressing,
                Version = Argon2Version.Nineteen,
                TimeCost = 2,
                MemoryCost = 65536,
                Lanes = 1,
                Threads = 1,
                HashLength = 32,
                Salt = RandomNumberGenerator.GetBytes(16),
                Password = Encoding.UTF8.GetBytes(password)
            };

            using var argon2 = new Argon2(config);
            using var hash = argon2.Hash();

            return config.EncodeString(hash.Buffer);
        }

        public static bool VerifyPassword(string password, string storedHash)
        {
            if (!storedHash.StartsWith("$argon2", StringComparison.OrdinalIgnoreCase))
                return password == storedHash;

            return Argon2.Verify(storedHash, password);
        }
    }
}
