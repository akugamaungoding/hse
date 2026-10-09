using astratech_apps_backend.DTOs.Upload.Request;
using astratech_apps_backend.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace astratech_apps_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UploadController(IConfiguration config, ILogger<UploadController> logger) : ControllerBase
    {
        private readonly IConfiguration _config = config;
        private readonly ILogger<UploadController> _logger = logger;
        private string? GetCurrentUsername() => User.FindFirstValue("namaakun");

        [HttpPost]
        public async Task<IActionResult> UploadFile([FromForm] UploadRequest dto)
        {
            var username = GetCurrentUsername();
            var file = dto.File;
            var modul = dto.Modul;

            if (file == null || file.Length == 0) return BadRequest(new { message = "Berkas tidak boleh kosong." });

            string safeModulName = new([.. modul.Where(char.IsLetterOrDigit)]);
            if (string.IsNullOrWhiteSpace(safeModulName)) safeModulName = "General";

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            bool isValidSignature = FileSignatureValidator.IsValidFileSignature(file.OpenReadStream(), ext);
            if (!isValidSignature)
            {
                _logger.LogWarning("Percobaan unggah berkas dengan signature tidak valid. Nama berkas: {FileName}. | [{Username}]", file.FileName, username);
                return BadRequest(new { message = "Isi berkas tidak sesuai dengan ekstensinya." });
            }

            if (!IsValidFileSize(file.Length, ext, out string errorMessage)) return BadRequest(new { message = errorMessage });

            try
            {
                string guid = Guid.NewGuid().ToString("N");
                string timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
                string newFileName = $"{guid}_{timestamp}{ext}";
                string basePath = _config["UploadSettings:storagePath"] ?? Path.Combine(Directory.GetCurrentDirectory(), "Files");
                string storagePath = Path.Combine(basePath, safeModulName);

                if (!Directory.Exists(storagePath)) Directory.CreateDirectory(storagePath);

                string fullPath = Path.Combine(storagePath, newFileName);

                await using var stream = new FileStream(fullPath, FileMode.Create);
                await file.CopyToAsync(stream);

                return Ok(new { message = "Berkas berhasil diunggah.", fileName = $"{safeModulName}/{newFileName}" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal menyimpan berkas {FileName}. | [{Username}]", file.FileName, username);
                return StatusCode(500, new { message = "Terjadi kesalahan pada server saat menyimpan berkas." });
            }
        }

        private bool IsValidFileSize(long fileSizeBytes, string ext, out string errorMessage)
        {
            errorMessage = string.Empty;
            long maxBytes;
            string category;

            const long MB_TO_BYTES = 1048576;

            switch (ext)
            {
                case ".jpg":
                case ".jpeg":
                case ".png":
                    maxBytes = _config.GetValue<long>("UploadSettings:maxSizeMBImage") * MB_TO_BYTES;
                    category = "Gambar";
                    break;

                case ".mp4":
                    maxBytes = _config.GetValue<long>("UploadSettings:maxSizeMBVideo") * MB_TO_BYTES;
                    category = "Video";
                    break;

                case ".zip":
                    maxBytes = _config.GetValue<long>("UploadSettings:maxSizeMBArchive") * MB_TO_BYTES;
                    category = "Arsip";
                    break;

                case ".txt":
                case ".csv":
                case ".docx":
                case ".pptx":
                case ".xlsx":
                case ".pdf":
                    maxBytes = _config.GetValue<long>("UploadSettings:maxSizeMBDocument") * MB_TO_BYTES;
                    category = "Dokumen";
                    break;

                default:
                    errorMessage = "Ekstensi berkas tidak didukung oleh sistem.";
                    return false;
            }

            if (fileSizeBytes > maxBytes)
            {
                errorMessage = $"Ukuran berkas {category} melebihi batas maksimal ({maxBytes / MB_TO_BYTES} MB).";
                return false;
            }

            return true;
        }
    }
}
