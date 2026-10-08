namespace astratech_apps_backend.DTOs.Institusi
{
    public record Institusi
    {
        public short Id { get; init; }
        public long RowNumber { get; init; } = 0;
        public string NamaInstitusi { get; init; } = string.Empty;
        public string NamaDirektur { get; init; } = string.Empty;
        public string NamaWadir1 { get; init; } = string.Empty;
        public string NamaWadir2 { get; init; } = string.Empty;
        public string NamaWadir3 { get; init; } = string.Empty;
        public string NamaWadir4 { get; init; } = string.Empty;
        public string Alamat { get; init; } = string.Empty;
        public string KodePos { get; init; } = string.Empty;
        public string Telepon { get; init; } = string.Empty;
        public string Fax { get; init; } = string.Empty;
        public string Email { get; init; } = string.Empty;
        public string Website { get; init; } = string.Empty;
        public DateTime TanggalBerdiri { get; init; }
        public string NomorSK { get; init; } = string.Empty;
        public DateTime TanggalSK { get; init; }
        public string Status { get; init; } = string.Empty;
    }
}
