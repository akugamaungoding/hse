using astratech_apps_backend.Helpers;
using astratech_apps_backend.Repositories.Implementations;
using astratech_apps_backend.Repositories.Interfaces;
using astratech_apps_backend.Services.Implementations;
using astratech_apps_backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Sinks.MSSqlServer;
using System.Text;

namespace astratech_apps_backend
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.WebHost.ConfigureKestrel(options =>
            {
                options.Limits.MaxRequestBodySize = 104857600;
            });
            builder.Services.Configure<FormOptions>(options =>
            {
                options.MultipartBodyLengthLimit = 104857600;
            });

            var configuration = builder.Configuration;

            var corsOrigin = configuration.GetSection("Key:corsAllowFrom").Get<string[]>();
            if (corsOrigin == null || corsOrigin.Length == 0)
                throw new InvalidOperationException("Konfigurasi CORS 'Key:corsAllowFrom' tidak ditemukan atau kosong.");

            var jwtKey = Environment.GetEnvironmentVariable("DECRYPT_KEY_JWT");
            if (string.IsNullOrEmpty(jwtKey))
                throw new InvalidOperationException("Environment variable 'DECRYPT_KEY_JWT' tidak ditemukan atau kosong.");

            var issuer = configuration.GetSection("Key:jwtIssuer").Get<string[]>();
            if (issuer == null || issuer.Length == 0)
                throw new InvalidOperationException("Konfigurasi JWT 'Key:jwtIssuer' tidak ditemukan atau kosong.");

            var audience = configuration["Key:jwtAudience"];
            if (string.IsNullOrEmpty(audience))
                throw new InvalidOperationException("Konfigurasi JWT 'Key:jwtAudience' tidak ditemukan atau kosong.");

            var encryptedConnSSO = configuration.GetConnectionString("DefaultConnectionSSO");
            var encryptedConnSIA = configuration.GetConnectionString("DefaultConnectionSIA");
            var decryptKeyConn = Environment.GetEnvironmentVariable("DECRYPT_KEY_CONNECTION_STRING");

            if (string.IsNullOrEmpty(encryptedConnSSO) || string.IsNullOrEmpty(encryptedConnSIA) || string.IsNullOrEmpty(decryptKeyConn))
                throw new InvalidOperationException("Environment variable 'DECRYPT_KEY_CONNECTION_STRING' atau konfigurasi ConnectionString tidak ditemukan atau kosong.");

            var decryptedConnSSO = PolmanAstraLibrary.PolmanAstraLibrary.Decrypt(encryptedConnSSO, decryptKeyConn);
            var decryptedConnSIA = PolmanAstraLibrary.PolmanAstraLibrary.Decrypt(encryptedConnSIA, decryptKeyConn);

            var emailConfig = new EmailConfig
            {
                Sender = configuration["Key:emailSender"]!,
                SmtpServer = configuration["Key:emailSMTPServer"]!,
                Port = int.Parse(configuration["Key:emailPort"] ?? "587"),
                Username = configuration["Key:emailUsername"]!,
                Password = configuration["Key:emailPassword"]!,
            };

            builder.Services.AddSingleton(new DatabaseConfig { ConnectionStringSSO = decryptedConnSSO, ConnectionStringSIA = decryptedConnSIA });
            builder.Services.AddSingleton(emailConfig);
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "ASTRATECH API", Version = "v1" });
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Masukkan token JWT:",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "bearer"
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });
            builder.Services.AddAutoMapper(typeof(Program));
            builder.Services.AddHttpContextAccessor();

            builder.Services.AddScoped<ILdapService, LdapService>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddScoped<IAuthorizationHandler, HasPermissionHandler>();

            builder.Services.AddScoped<IInstitusiRepository, InstitusiRepository>();

            builder.Services.AddAuthorizationBuilder()
                .AddPolicy("HasPermission", policy =>
                {
                    policy.AddRequirements(new HasPermissionRequirement());
                });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builderCors =>
                    {
                        builderCors.WithOrigins(corsOrigin!)
                               .AllowAnyHeader()
                               .AllowAnyMethod();
                    });
            });

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuers = issuer,
                    ValidAudience = audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!))
                };
            });

            builder.Services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    var errors = context.ModelState.Where(ms => ms.Value?.Errors.Count > 0).Select(ms => ms.Value?.Errors.Select(e => e.ErrorMessage));
                    var result = new BadRequestObjectResult(new
                    {
                        message = "Bentuk payload yang dikirimkan tidak valid.",
                        errors
                    });
                    return result;
                };
            });

            Log.Logger = new LoggerConfiguration().WriteTo.MSSqlServer(connectionString: decryptedConnSIA, sinkOptions: new MSSqlServerSinkOptions
            {
                TableName = "TRX_ErrorLog",
                AutoCreateSqlTable = true
            }).MinimumLevel.Warning().CreateLogger();

            builder.Host.UseSerilog();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            else
            {
                app.UseHttpsRedirection();
            }
            app.UseCors("AllowSpecificOrigin");
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
