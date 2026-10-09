using System.ComponentModel.DataAnnotations;

namespace astratech_apps_backend.DTOs.Institusi.Request
{
    public record GetAllInstitusiRequest
    {
        [Range(1, int.MaxValue, ErrorMessage = "Nomor halaman minimal 1.")]
        public int PageNumber { get; init; } = 1;

        [Range(1, 100, ErrorMessage = "Ukuran data per halaman antara 1 hingga 100.")]
        public int PageSize { get; init; } = 10;

        public string SearchKeyword { get; init; } = string.Empty;
        public string Status { get; init; } = string.Empty;

        [Required(ErrorMessage = "Jenis urut harus diisi.")]
        public string Urut { get; init; } = string.Empty;
    }
}
