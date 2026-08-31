using System.Text;
using TanggapDaruratApi.Helpers;
using TanggapDaruratApi.Repositories.Implementations;
using TanggapDaruratApi.Repositories.Interfaces;
using TanggapDaruratApi.Services.Implementations;
using TanggapDaruratApi.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Sinks.MSSqlServer;

namespace TanggapDaruratApi
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;

            var builder = WebApplication.CreateBuilder(args);
            var configuration = builder.Configuration;

            var corsOrigin = configuration.GetSection("Key:corsAllowFrom").Get<string[]>();
            if (corsOrigin == null || corsOrigin.Length == 0)
                throw new InvalidOperationException("Konfigurasi CORS 'Key:corsAllowFrom' tidak ditemukan atau kosong.");


            var conn = configuration.GetConnectionString("DefaultConnection");
            if (string.IsNullOrEmpty(conn))
                throw new InvalidOperationException("Konfigurasi ConnectionString tidak ditemukan atau kosong.");

            builder.Services.AddSingleton(new DatabaseConfig { ConnectionString = conn });

            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
                });
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "ASTRAtech Tanggap Darurat API", Version = "v1" });
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
                            Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            builder.Services.AddAutoMapper(typeof(Program));
            builder.Services.AddHttpContextAccessor();

            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IKejadianRepository, KejadianRepository>();
            builder.Services.AddScoped<ILantaiRepository, LantaiRepository>();
            builder.Services.AddScoped<IEvakuasiRepository, EvakuasiRepository>();
            builder.Services.AddScoped<IAssemblyPointRepository, AssemblyPointRepository>();
            builder.Services.AddScoped<IP3KRepository, P3KRepository>();
            builder.Services.AddScoped<IPemadamanRepository, PemadamanRepository>();
            builder.Services.AddScoped<IKoordinasiRepository, KoordinasiRepository>();
            builder.Services.AddScoped<ILaporanRepository, LaporanRepository>();
            builder.Services.AddScoped<INotifikasiRepository, NotifikasiRepository>();
            builder.Services.AddScoped<IAsetRepository, AsetRepository>();
            builder.Services.AddScoped<ISimulasiRepository, SimulasiRepository>();

            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IKejadianService, KejadianService>();
            builder.Services.AddScoped<IEvakuasiService, EvakuasiService>();
            builder.Services.AddScoped<IAssemblyPointService, AssemblyPointService>();
            builder.Services.AddScoped<IP3KService, P3KService>();
            builder.Services.AddScoped<IPemadamanService, PemadamanService>();
            builder.Services.AddScoped<IKoordinasiService, KoordinasiService>();
            builder.Services.AddScoped<ILaporanService, LaporanService>();
            builder.Services.AddScoped<INotifikasiService, NotifikasiService>();
            builder.Services.AddScoped<IAsetService, AsetService>();
            builder.Services.AddScoped<ISimulasiService, SimulasiService>();

            builder.Services.AddScoped<IAuthorizationHandler, HasPermissionHandler>();

            builder.Services.AddAuthorizationBuilder()
                .AddPolicy("HasPermission", policy =>
                {
                    policy.AddRequirements(new HasPermissionRequirement());
                });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin", builderCors =>
                {
                    builderCors.WithOrigins(corsOrigin!)
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
            });



            builder.Services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    var errors = context.ModelState.Where(ms => ms.Value?.Errors.Count > 0)
                        .Select(ms => ms.Value?.Errors.Select(e => e.ErrorMessage));
                    return new BadRequestObjectResult(new
                    {
                        message = "Bentuk payload yang dikirimkan tidak valid.",
                        errors
                    });
                };
            });

            try
            {
                Log.Logger = new LoggerConfiguration().WriteTo.MSSqlServer(connectionString: conn, sinkOptions: new MSSqlServerSinkOptions
                {
                    TableName = "TD_ErrorLog",
                    AutoCreateSqlTable = true
                }).MinimumLevel.Warning().CreateLogger();
                builder.Host.UseSerilog();
            }
            catch
            {
            }

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

            app.Use(async (context, next) =>
            {
                var userIdStr = context.Request.Headers["X-User-Id"].FirstOrDefault() ?? "1";
                var roleCode = context.Request.Headers["X-Role-Code"].FirstOrDefault() ?? "CIVITAS";
                var username = context.Request.Headers["X-Username"].FirstOrDefault() ?? "system";

                var claims = new System.Collections.Generic.List<System.Security.Claims.Claim>
                {
                    new System.Security.Claims.Claim("userid", userIdStr),
                    new System.Security.Claims.Claim("idrole", roleCode),
                    new System.Security.Claims.Claim("namaakun", username)
                };

                var identity = new System.Security.Claims.ClaimsIdentity(claims, "Mock");
                context.User = new System.Security.Claims.ClaimsPrincipal(identity);

                await next();
            });

            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
