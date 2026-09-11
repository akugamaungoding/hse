FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

RUN apt-get update && apt-get install -y \
    libldap-2.5-0 \
    libldap-common \
    && rm -rf /var/lib/apt/lists/*

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj dulu untuk layer caching
COPY ["TanggapDaruratApi.csproj", "./"]
RUN dotnet restore

# Karena sudah pakai .dockerignore, file sensitif di host otomatis tidak ikut ter-copy
COPY . .

RUN dotnet publish -c Release -o /app/publish --no-restore

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

# Membuat file kosong untuk mencegah error jika appsettings tidak di-mount
RUN echo '{}' > appsettings.Production.json

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "TanggapDaruratApi.dll"]
