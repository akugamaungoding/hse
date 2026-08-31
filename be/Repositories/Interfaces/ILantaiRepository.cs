namespace TanggapDaruratApi.Repositories.Interfaces
{
    public class LantaiItem
    {
        public int LantaiId { get; set; }
        public string Gedung { get; set; } = string.Empty;
        public string NamaLantai { get; set; } = string.Empty;
        public int Urutan { get; set; }
    }

    public interface ILantaiRepository
    {
        Task<IEnumerable<LantaiItem>> GetAllActiveAsync();
    }
}
