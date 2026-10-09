namespace astratech_apps_backend.Helpers
{
    public record EmailConfig
    {
        public string Sender { get; init; } = string.Empty;
        public string SmtpServer { get; init; } = string.Empty;
        public int Port { get; init; }
        public string Username { get; init; } = string.Empty;
        public string Password { get; init; } = string.Empty;
    }
}
