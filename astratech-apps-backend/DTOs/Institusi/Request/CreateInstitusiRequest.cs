using System.ComponentModel.DataAnnotations;

namespace astratech_apps_backend.DTOs.Institusi.Request
{
    public record CreateInstitusiRequest
    {
        [Required(ErrorMessage = "Nama institusi harus diisi.")]
        [StringLength(100)]
        public string NamaInstitusi { get; init; } = string.Empty;

        [Required(ErrorMessage = "Nama direktur harus diisi.")]
        [StringLength(50)]
        public string NamaDirektur { get; init; } = string.Empty;

        [Required(ErrorMessage = "Nama wakil direktur 1 harus diisi.")]
        [StringLength(50)]
        public string NamaWadir1 { get; init; } = string.Empty;

        [StringLength(50)]
        public string NamaWadir2 { get; init; } = string.Empty;

        [StringLength(50)]
        public string NamaWadir3 { get; init; } = string.Empty;

        [StringLength(50)]
        public string NamaWadir4 { get; init; } = string.Empty;

        [Required(ErrorMessage = "Alamat harus diisi.")]
        [StringLength(200)]
        public string Alamat { get; init; } = string.Empty;

        [Required(ErrorMessage = "Kode pos harus diisi.")]
        [StringLength(5)]
        public string KodePos { get; init; } = string.Empty;

        [StringLength(15)]
        public string Telepon { get; init; } = string.Empty;

        [StringLength(15)]
        public string Fax { get; init; } = string.Empty;

        [EmailAddress(ErrorMessage = "Format email tidak valid.")]
        [StringLength(50)]
        public string Email { get; init; } = string.Empty;

        [StringLength(50)]
        public string Website { get; init; } = string.Empty;

        public DateTime? TanggalBerdiri { get; init; }

        [Required(ErrorMessage = "Nomor SK harus diisi.")]
        [StringLength(50)]
        public string NomorSK { get; init; } = string.Empty;

        [Required(ErrorMessage = "Tanggal SK harus diisi.")]
        public DateTime? TanggalSK { get; init; }
    }
}
