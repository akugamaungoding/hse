using astratech_apps_backend.Helpers;
using astratech_apps_backend.Services.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace astratech_apps_backend.Services.Implementations
{
    public class EmailService(EmailConfig config, ILogger<EmailService> logger) : IEmailService
    {
        private readonly EmailConfig _config = config;
        private readonly ILogger<EmailService> _logger = logger;

        public async Task<bool> SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(_config.Sender));
                email.To.Add(MailboxAddress.Parse(toEmail));
                email.Subject = subject;

                email.Body = new TextPart(isHtml ? TextFormat.Html : TextFormat.Plain)
                {
                    Text = body
                };

                using var smtp = new SmtpClient();

                await smtp.ConnectAsync(_config.SmtpServer, _config.Port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_config.Username, _config.Password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal mengirim email ke {Recipient}", toEmail);
                return false;
            }
        }
    }
}