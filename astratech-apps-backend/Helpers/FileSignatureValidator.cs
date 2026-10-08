using System.Text;

namespace astratech_apps_backend.Helpers
{
    public static class FileSignatureValidator
    {
        private static readonly Dictionary<string, List<byte[]>> _fileSignatures = new(StringComparer.OrdinalIgnoreCase)
        {
            { ".jpg", [[0xFF, 0xD8, 0xFF]] },
            { ".jpeg", [[0xFF, 0xD8, 0xFF]] },
            { ".png", [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]] },
            { ".pdf", [[0x25, 0x50, 0x44, 0x46]] },
            { ".zip", [[0x50, 0x4B, 0x03, 0x04], [0x50, 0x4B, 0x4C, 0x49], [0x50, 0x4B, 0x05, 0x06]] },
            { ".docx", [[0x50, 0x4B, 0x03, 0x04]] },
            { ".xlsx", [[0x50, 0x4B, 0x03, 0x04]] },
            { ".pptx", [[0x50, 0x4B, 0x03, 0x04]] }
        };

        public static bool IsValidFileSignature(Stream stream, string expectedExtension)
        {
            if (stream == null || stream.Length == 0) return false;

            long originalPosition = stream.Position;
            stream.Position = 0;

            try
            {
                if (expectedExtension.Equals(".txt", StringComparison.OrdinalIgnoreCase) ||
                    expectedExtension.Equals(".csv", StringComparison.OrdinalIgnoreCase))
                {
                    return IsTextFile(stream);
                }

                using var reader = new BinaryReader(stream, Encoding.UTF8, leaveOpen: true);
                byte[] headerBytes = reader.ReadBytes(8);

                if (expectedExtension.Equals(".mp4", StringComparison.OrdinalIgnoreCase))
                {
                    return IsMp4File(headerBytes);
                }

                if (_fileSignatures.TryGetValue(expectedExtension, out var signatures))
                {
                    return signatures.Any(signature => headerBytes.Take(signature.Length).SequenceEqual(signature));
                }

                return false;
            }
            finally
            {
                stream.Position = originalPosition;
            }
        }

        private static bool IsTextFile(Stream stream)
        {
            int sampleSize = (int)Math.Min(stream.Length, 512);
            byte[] buffer = new byte[sampleSize];
            _ = stream.Read(buffer, 0, sampleSize);

            return !buffer.Contains((byte)0x00);
        }

        private static bool IsMp4File(byte[] headerBytes)
        {
            if (headerBytes.Length < 8) return false;

            return headerBytes[4] == 0x66 && headerBytes[5] == 0x74 && headerBytes[6] == 0x79 && headerBytes[7] == 0x70;
        }
    }
}
