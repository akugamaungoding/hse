namespace TanggapDaruratApi.DTOs.Kejadian.Response
{
    public record KejadianStatusResponse
    {
        public Kejadian Header { get; init; } = new();
        public List<EvakuasiLantaiItem> Evakuasi { get; init; } = [];
        public AssemblyRekapItem? Assembly { get; init; }
        public P3KItem? P3K { get; init; }
        public PemadamanItem? Pemadaman { get; init; }
        public List<KoordinasiItem> Koordinasi { get; init; } = [];
        public LaporanItem? Laporan { get; init; }
    }

    public record EvakuasiLantaiItem
    {
        public int EvakuasiId { get; init; }
        public int LantaiId { get; init; }
        public string Gedung { get; init; } = string.Empty;
        public string NamaLantai { get; init; } = string.Empty;
        public string Status { get; init; } = string.Empty;
        public DateTime? WaktuInstruksi { get; init; }
        public DateTime? WaktuLaporan { get; init; }
        public string? Catatan { get; init; }
    }

    public record AssemblyRekapItem
    {
        public int TotalTerdaftar { get; init; }
        public int TotalHadir { get; init; }
        public bool SudahDikonfirmasi { get; init; }
        public DateTime? WaktuKonfirmasi { get; init; }
    }

    public record P3KItem
    {
        public bool AdaKorban { get; init; }
        public int? JumlahKorban { get; init; }
        public string? KondisiKorban { get; init; }
        public string? Tindakan { get; init; }
        public bool PerluAmbulans { get; init; }
        public DateTime? WaktuPanggilAmbulans { get; init; }
        public DateTime? WaktuLaporan { get; init; }
    }

    public record PemadamanItem
    {
        public string? SumberApi { get; init; }
        public bool PerluDamkar { get; init; }
        public DateTime? WaktuPanggilDamkar { get; init; }
        public string? HasilPemadaman { get; init; }
        public DateTime? WaktuLaporan { get; init; }
    }

    public record KoordinasiItem
    {
        public string Catatan { get; init; } = string.Empty;
        public string? DiupdateOlehNama { get; init; }
        public DateTime WaktuUpdate { get; init; }
    }

    public record LaporanItem
    {
        public string Ringkasan { get; init; } = string.Empty;
        public string? TindakLanjut { get; init; }
        public DateTime WaktuLaporan { get; init; }
    }
}
