/* ============================================================
   DATABASE SETUP & COMPLETE SCHEMA SCRIPT
   DATABASE : DB_HSE (Modul Tanggap Darurat & Manajemen Aset ASTRAtech)
   FILE     : be/SQL/db_hse_complete.sql
   SUMMARY  : Script tunggal lengkap berisi:
              1. Create Database DB_HSE
              2. Pembuatan Seluruh Tabel (Master & Transaksi)
              3. Seed Data (12 Role, Super Admin User, Master Lantai, Inventaris 100+ Aset)
              4. Seluruh Stored Procedure (49 SPs)
   ============================================================ */

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'DB_HSE')
BEGIN
    CREATE DATABASE DB_HSE;
END;
GO

USE DB_HSE;
GO

/* ============================================================
   1. PEMBUATAN TABEL MASTER & TRANSAKSI
   ============================================================ */

-- 1. MST_Role
IF OBJECT_ID('dbo.MST_Role', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.MST_Role
    (
        rol_id              INT IDENTITY(1,1) NOT NULL,
        rol_code            VARCHAR(30) NOT NULL,
        rol_name            NVARCHAR(100) NOT NULL,
        rol_status          VARCHAR(30) NOT NULL DEFAULT 'Aktif',
        rol_is_deleted      BIT NOT NULL DEFAULT 0,
        rol_created_by      VARCHAR(50) NOT NULL,
        rol_created_date    DATETIME NOT NULL DEFAULT GETDATE(),
        rol_modified_by     VARCHAR(50) NULL,
        rol_modified_date   DATETIME NULL,
        rol_deleted_by      VARCHAR(50) NULL,
        rol_deleted_date    DATETIME NULL,
        CONSTRAINT PK_MST_Role PRIMARY KEY (rol_id),
        CONSTRAINT UQ_MST_Role_Code UNIQUE (rol_code)
    );
END;
GO

-- 2. MST_User
IF OBJECT_ID('dbo.MST_User', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.MST_User
    (
        use_id              INT IDENTITY(1,1) NOT NULL,
        use_username        VARCHAR(50) NOT NULL,
        use_password_hash   VARCHAR(255) NOT NULL,
        use_nama            NVARCHAR(100) NOT NULL,
        use_email           VARCHAR(100) NULL,
        use_no_hp           VARCHAR(20) NULL,
        rol_id              INT NOT NULL,
        use_status          VARCHAR(30) NOT NULL DEFAULT 'Aktif',
        use_is_deleted      BIT NOT NULL DEFAULT 0,
        use_created_by      VARCHAR(50) NOT NULL,
        use_created_date    DATETIME NOT NULL DEFAULT GETDATE(),
        use_modified_by     VARCHAR(50) NULL,
        use_modified_date   DATETIME NULL,
        use_deleted_by      VARCHAR(50) NULL,
        use_deleted_date    DATETIME NULL,
        CONSTRAINT PK_MST_User PRIMARY KEY (use_id),
        CONSTRAINT UQ_MST_User_Username UNIQUE (use_username),
        CONSTRAINT FK_MST_User_MST_Role FOREIGN KEY (rol_id) REFERENCES dbo.MST_Role(rol_id)
    );
END;
GO

-- 3. MST_Lantai
IF OBJECT_ID('dbo.MST_Lantai', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.MST_Lantai
    (
        lan_id              INT IDENTITY(1,1) NOT NULL,
        lan_gedung          NVARCHAR(50) NOT NULL,
        lan_nama_lantai     NVARCHAR(50) NOT NULL,
        lan_urutan          INT NOT NULL DEFAULT 0,
        lan_status          VARCHAR(30) NOT NULL DEFAULT 'Aktif',
        lan_is_deleted      BIT NOT NULL DEFAULT 0,
        lan_created_by      VARCHAR(50) NOT NULL,
        lan_created_date    DATETIME NOT NULL DEFAULT GETDATE(),
        lan_modified_by     VARCHAR(50) NULL,
        lan_modified_date   DATETIME NULL,
        lan_deleted_by      VARCHAR(50) NULL,
        lan_deleted_date    DATETIME NULL,
        CONSTRAINT PK_MST_Lantai PRIMARY KEY (lan_id)
    );
END;
GO

-- 4. MST_Aset
IF OBJECT_ID('dbo.MST_Aset', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.MST_Aset
    (
        ase_id              VARCHAR(50) NOT NULL,
        ase_tipe            VARCHAR(30) NOT NULL, -- APAR, HYDRANT_BOX, POMPA_HYDRANT, EMERGENCY_BOX, APD
        ase_lokasi          NVARCHAR(200) NOT NULL,
        ase_detail          NVARCHAR(500) NULL,
        ase_expired_date    DATETIME NULL,
        ase_status          VARCHAR(30) NOT NULL DEFAULT 'Aman', -- Aman, Perlu Inspeksi, Rusak
        ase_last_inspeksi   DATETIME NULL,
        ase_is_deleted      BIT NOT NULL DEFAULT 0,
        ase_created_by      VARCHAR(50) NOT NULL,
        ase_created_date    DATETIME NOT NULL DEFAULT GETDATE(),
        ase_modified_by     VARCHAR(50) NULL,
        ase_modified_date   DATETIME NULL,
        CONSTRAINT PK_MST_Aset PRIMARY KEY (ase_id)
    );
END;
GO

-- 5. TRX_Kejadian
IF OBJECT_ID('dbo.TRX_Kejadian', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.TRX_Kejadian
    (
        kej_id                          INT IDENTITY(1,1) NOT NULL,
        kej_kode_kejadian               VARCHAR(20) NOT NULL,
        kej_jenis_kejadian              NVARCHAR(50) NOT NULL,
        kej_lokasi                      NVARCHAR(200) NOT NULL,
        kej_deskripsi                   NVARCHAR(1000) NULL,
        kej_foto_url                    NVARCHAR(300) NULL,
        kej_status                      VARCHAR(30) NOT NULL DEFAULT 'Menunggu Validasi',
        use_id_pelapor                  INT NOT NULL,
        kej_waktu_lapor                 DATETIME NOT NULL DEFAULT GETDATE(),
        use_id_validator                INT NULL,
        kej_waktu_validasi              DATETIME NULL,
        kej_hasil_validasi               BIT NULL,
        kej_catatan_validasi            NVARCHAR(500) NULL,
        use_id_pengumum                 INT NULL,
        kej_waktu_pengumuman_darurat    DATETIME NULL,
        kej_waktu_pengumuman_aman       DATETIME NULL,
        use_id_penetap_aman             INT NULL,
        kej_waktu_ditetapkan_aman       DATETIME NULL,
        kej_created_by                  VARCHAR(50) NOT NULL,
        kej_created_date                DATETIME NOT NULL DEFAULT GETDATE(),
        kej_modified_by                 VARCHAR(50) NULL,
        kej_modified_date               DATETIME NULL,
        CONSTRAINT PK_TRX_Kejadian PRIMARY KEY (kej_id),
        CONSTRAINT UQ_TRX_Kejadian_Code UNIQUE (kej_kode_kejadian),
        CONSTRAINT FK_TRX_Kejadian_MST_User_Pelapor FOREIGN KEY (use_id_pelapor) REFERENCES dbo.MST_User(use_id),
        CONSTRAINT FK_TRX_Kejadian_MST_User_Validator FOREIGN KEY (use_id_validator) REFERENCES dbo.MST_User(use_id),
        CONSTRAINT FK_TRX_Kejadian_MST_User_Pengumum FOREIGN KEY (use_id_pengumum) REFERENCES dbo.MST_User(use_id),
        CONSTRAINT FK_TRX_Kejadian_MST_User_PenetapAman FOREIGN KEY (use_id_penetap_aman) REFERENCES dbo.MST_User(use_id)
    );
END;
GO

-- 6. TRX_EvakuasiLantai
IF OBJECT_ID('dbo.TRX_EvakuasiLantai', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.TRX_EvakuasiLantai
    (
        eva_id                      INT IDENTITY(1,1) NOT NULL,
        kej_id                      INT NOT NULL,
        lan_id                      INT NOT NULL,
        eva_status                  VARCHAR(30) NOT NULL DEFAULT 'Belum',
        use_id_instruksi            INT NULL,
        eva_waktu_instruksi         DATETIME NULL,
        use_id_pelapor              INT NULL,
        eva_waktu_laporan           DATETIME NULL,
        eva_catatan                 NVARCHAR(300) NULL,
        eva_created_by              VARCHAR(50) NOT NULL,
        eva_created_date            DATETIME NOT NULL DEFAULT GETDATE(),
        eva_modified_by             VARCHAR(50) NULL,
        eva_modified_date           DATETIME NULL,
        CONSTRAINT PK_TRX_EvakuasiLantai PRIMARY KEY (eva_id),
        CONSTRAINT UQ_TRX_EvakuasiLantai UNIQUE (kej_id, lan_id),
        CONSTRAINT FK_TRX_EvakuasiLantai_TRX_Kejadian FOREIGN KEY (kej_id) REFERENCES dbo.TRX_Kejadian(kej_id),
        CONSTRAINT FK_TRX_EvakuasiLantai_MST_Lantai FOREIGN KEY (lan_id) REFERENCES dbo.MST_Lantai(lan_id),
        CONSTRAINT FK_TRX_EvakuasiLantai_MST_User_Instruksi FOREIGN KEY (use_id_instruksi) REFERENCES dbo.MST_User(use_id),
        CONSTRAINT FK_TRX_EvakuasiLantai_MST_User_Pelapor FOREIGN KEY (use_id_pelapor) REFERENCES dbo.MST_User(use_id)
    );
END;
GO

-- 7. TRX_AbsensiAssembly
IF OBJECT_ID('dbo.TRX_AbsensiAssembly', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.TRX_AbsensiAssembly
    (
        abs_id                  INT IDENTITY(1,1) NOT NULL,
        kej_id                  INT NOT NULL,
        use_id                  INT NOT NULL,
        abs_kode_assembly       VARCHAR(30) NULL,
        abs_waktu_scan          DATETIME NOT NULL DEFAULT GETDATE(),
        abs_created_by          VARCHAR(50) NOT NULL,
        abs_created_date        DATETIME NOT NULL DEFAULT GETDATE(),
        abs_modified_by         VARCHAR(50) NULL,
        abs_modified_date       DATETIME NULL,
        CONSTRAINT PK_TRX_AbsensiAssembly PRIMARY KEY (abs_id),
        CONSTRAINT UQ_TRX_AbsensiAssembly UNIQUE (kej_id, use_id),
        CONSTRAINT FK_TRX_AbsensiAssembly_TRX_Kejadian FOREIGN KEY (kej_id) REFERENCES dbo.TRX_Kejadian(kej_id),
        CONSTRAINT FK_TRX_AbsensiAssembly_MST_User FOREIGN KEY (use_id) REFERENCES dbo.MST_User(use_id)
    );
END;
GO

-- 8. TRX_AssemblyKonfirmasi
IF OBJECT_ID('dbo.TRX_AssemblyKonfirmasi', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.TRX_AssemblyKonfirmasi
    (
        asm_id                  INT IDENTITY(1,1) NOT NULL,
        kej_id                  INT NOT NULL,
        use_id_konfirmasi       INT NOT NULL,
        asm_waktu_konfirmasi    DATETIME NOT NULL DEFAULT GETDATE(),
        asm_created_by          VARCHAR(50) NOT NULL,
        asm_created_date        DATETIME NOT NULL DEFAULT GETDATE(),
        asm_modified_by         VARCHAR(50) NULL,
        asm_modified_date       DATETIME NULL,
        CONSTRAINT PK_TRX_AssemblyKonfirmasi PRIMARY KEY (asm_id),
        CONSTRAINT UQ_TRX_AssemblyKonfirmasi UNIQUE (kej_id),
        CONSTRAINT FK_TRX_AssemblyKonfirmasi_TRX_Kejadian FOREIGN KEY (kej_id) REFERENCES dbo.TRX_Kejadian(kej_id),
        CONSTRAINT FK_TRX_AssemblyKonfirmasi_MST_User FOREIGN KEY (use_id_konfirmasi) REFERENCES dbo.MST_User(use_id)
    );
END;
GO

-- 9. TRX_PertolonganPertama
IF OBJECT_ID('dbo.TRX_PertolonganPertama', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.TRX_PertolonganPertama
    (
        per_id                  INT IDENTITY(1,1) NOT NULL,
        kej_id                  INT NOT NULL,
        per_ada_korban          BIT NOT NULL DEFAULT 0,
        per_jumlah_korban       INT NULL,
        per_kondisi_korban      NVARCHAR(300) NULL,
        per_tindakan            NVARCHAR(500) NULL,
        per_perlu_ambulans      BIT NOT NULL DEFAULT 0,
        per_waktu_ambulans      DATETIME NULL,
        use_id_penanganan       INT NULL,
        per_waktu_laporan       DATETIME NULL,
        per_created_by          VARCHAR(50) NOT NULL,
        per_created_date        DATETIME NOT NULL DEFAULT GETDATE(),
        per_modified_by         VARCHAR(50) NULL,
        per_modified_date       DATETIME NULL,
        CONSTRAINT PK_TRX_PertolonganPertama PRIMARY KEY (per_id),
        CONSTRAINT UQ_TRX_PertolonganPertama UNIQUE (kej_id),
        CONSTRAINT FK_TRX_PertolonganPertama_TRX_Kejadian FOREIGN KEY (kej_id) REFERENCES dbo.TRX_Kejadian(kej_id),
        CONSTRAINT FK_TRX_PertolonganPertama_MST_User FOREIGN KEY (use_id_penanganan) REFERENCES dbo.MST_User(use_id)
    );
END;
GO

-- 10. TRX_Pemadaman
IF OBJECT_ID('dbo.TRX_Pemadaman', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.TRX_Pemadaman
    (
        pem_id                  INT IDENTITY(1,1) NOT NULL,
        kej_id                  INT NOT NULL,
        pem_sumber_api          NVARCHAR(200) NULL,
        pem_perlu_damkar        BIT NOT NULL DEFAULT 0,
        pem_waktu_damkar        DATETIME NULL,
        pem_hasil_pemadaman     NVARCHAR(500) NULL,
        use_id_penanganan       INT NULL,
        pem_waktu_laporan       DATETIME NULL,
        pem_created_by          VARCHAR(50) NOT NULL,
        pem_created_date        DATETIME NOT NULL DEFAULT GETDATE(),
        pem_modified_by         VARCHAR(50) NULL,
        pem_modified_date       DATETIME NULL,
        CONSTRAINT PK_TRX_Pemadaman PRIMARY KEY (pem_id),
        CONSTRAINT UQ_TRX_Pemadaman UNIQUE (kej_id),
        CONSTRAINT FK_TRX_Pemadaman_TRX_Kejadian FOREIGN KEY (kej_id) REFERENCES dbo.TRX_Kejadian(kej_id),
        CONSTRAINT FK_TRX_Pemadaman_MST_User FOREIGN KEY (use_id_penanganan) REFERENCES dbo.MST_User(use_id)
    );
END;
GO

-- 11. TRX_KoordinasiKondisi
IF OBJECT_ID('dbo.TRX_KoordinasiKondisi', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.TRX_KoordinasiKondisi
    (
        koo_id                  INT IDENTITY(1,1) NOT NULL,
        kej_id                  INT NOT NULL,
        koo_catatan             NVARCHAR(500) NOT NULL,
        use_id_pengupdate       INT NOT NULL,
        koo_waktu_update        DATETIME NOT NULL DEFAULT GETDATE(),
        koo_created_by          VARCHAR(50) NOT NULL,
        koo_created_date        DATETIME NOT NULL DEFAULT GETDATE(),
        koo_modified_by         VARCHAR(50) NULL,
        koo_modified_date       DATETIME NULL,
        CONSTRAINT PK_TRX_KoordinasiKondisi PRIMARY KEY (koo_id),
        CONSTRAINT FK_TRX_KoordinasiKondisi_TRX_Kejadian FOREIGN KEY (kej_id) REFERENCES dbo.TRX_Kejadian(kej_id),
        CONSTRAINT FK_TRX_KoordinasiKondisi_MST_User FOREIGN KEY (use_id_pengupdate) REFERENCES dbo.MST_User(use_id)
    );
END;
GO

-- 12. TRX_LaporanKejadian
IF OBJECT_ID('dbo.TRX_LaporanKejadian', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.TRX_LaporanKejadian
    (
        lap_id                  INT IDENTITY(1,1) NOT NULL,
        kej_id                  INT NOT NULL,
        lap_ringkasan           NVARCHAR(2000) NOT NULL,
        lap_tindak_lanjut       NVARCHAR(1000) NULL,
        lap_file_url             NVARCHAR(300) NULL,
        use_id_pembuat          INT NOT NULL,
        lap_waktu_laporan       DATETIME NOT NULL DEFAULT GETDATE(),
        lap_created_by          VARCHAR(50) NOT NULL,
        lap_created_date        DATETIME NOT NULL DEFAULT GETDATE(),
        lap_modified_by         VARCHAR(50) NULL,
        lap_modified_date       DATETIME NULL,
        CONSTRAINT PK_TRX_LaporanKejadian PRIMARY KEY (lap_id),
        CONSTRAINT UQ_TRX_LaporanKejadian UNIQUE (kej_id),
        CONSTRAINT FK_TRX_LaporanKejadian_TRX_Kejadian FOREIGN KEY (kej_id) REFERENCES dbo.TRX_Kejadian(kej_id),
        CONSTRAINT FK_TRX_LaporanKejadian_MST_User FOREIGN KEY (use_id_pembuat) REFERENCES dbo.MST_User(use_id)
    );
END;
GO

-- 13. TRX_Notifikasi
IF OBJECT_ID('dbo.TRX_Notifikasi', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.TRX_Notifikasi
    (
        not_id                  INT IDENTITY(1,1) NOT NULL,
        use_id                  INT NULL,
        kej_id                  INT NULL,
        not_judul               NVARCHAR(150) NOT NULL,
        not_pesan               NVARCHAR(500) NOT NULL,
        not_tipe                VARCHAR(30) NOT NULL DEFAULT 'Info',
        not_is_read             BIT NOT NULL DEFAULT 0,
        not_created_by          VARCHAR(50) NOT NULL,
        not_created_date        DATETIME NOT NULL DEFAULT GETDATE(),
        not_modified_by         VARCHAR(50) NULL,
        not_modified_date       DATETIME NULL,
        CONSTRAINT PK_TRX_Notifikasi PRIMARY KEY (not_id),
        CONSTRAINT FK_TRX_Notifikasi_MST_User FOREIGN KEY (use_id) REFERENCES dbo.MST_User(use_id),
        CONSTRAINT FK_TRX_Notifikasi_TRX_Kejadian FOREIGN KEY (kej_id) REFERENCES dbo.TRX_Kejadian(kej_id)
    );
END;
GO

-- 14. TRX_TindakLanjutGA
IF OBJECT_ID('dbo.TRX_TindakLanjutGA', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.TRX_TindakLanjutGA
    (
        tin_id                  INT IDENTITY(1,1) NOT NULL,
        kej_id                  INT NOT NULL,
        tin_catatan             NVARCHAR(500) NULL,
        use_id_pemproses         INT NULL,
        tin_waktu_proses        DATETIME NULL,
        tin_status              VARCHAR(30) NOT NULL DEFAULT 'Terbuka',
        tin_created_by          VARCHAR(50) NOT NULL,
        tin_created_date        DATETIME NOT NULL DEFAULT GETDATE(),
        tin_modified_by         VARCHAR(50) NULL,
        tin_modified_date       DATETIME NULL,
        CONSTRAINT PK_TRX_TindakLanjutGA PRIMARY KEY (tin_id),
        CONSTRAINT UQ_TRX_TindakLanjutGA UNIQUE (kej_id),
        CONSTRAINT FK_TRX_TindakLanjutGA_TRX_Kejadian FOREIGN KEY (kej_id) REFERENCES dbo.TRX_Kejadian(kej_id),
        CONSTRAINT FK_TRX_TindakLanjutGA_MST_User FOREIGN KEY (use_id_pemproses) REFERENCES dbo.MST_User(use_id)
    );
END;
GO

-- 15. TRX_InspeksiAset (Termasuk kolom revisi ins_foto_before_url & ins_foto_after_url)
IF OBJECT_ID('dbo.TRX_InspeksiAset', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.TRX_InspeksiAset
    (
        ins_id                  INT IDENTITY(1,1) NOT NULL,
        ase_id                  VARCHAR(50) NOT NULL,
        ins_tanggal             DATETIME NOT NULL DEFAULT GETDATE(),
        use_id_petugas          INT NOT NULL,
        ins_status              VARCHAR(30) NOT NULL,
        ins_catatan             NVARCHAR(500) NULL,
        ins_foto_url            NVARCHAR(300) NULL,
        ins_foto_before_url     NVARCHAR(300) NULL,
        ins_foto_after_url      NVARCHAR(300) NULL,
        ins_form_data           NVARCHAR(MAX) NULL, -- JSON Dynamic Form
        ins_created_by          VARCHAR(50) NOT NULL,
        ins_created_date        DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT PK_TRX_InspeksiAset PRIMARY KEY (ins_id),
        CONSTRAINT FK_TRX_InspeksiAset_MST_Aset FOREIGN KEY (ase_id) REFERENCES dbo.MST_Aset(ase_id),
        CONSTRAINT FK_TRX_InspeksiAset_MST_User FOREIGN KEY (use_id_petugas) REFERENCES dbo.MST_User(use_id)
    );
END;
GO

-- 16. TRX_SimulasiTanggapDarurat
IF OBJECT_ID('dbo.TRX_SimulasiTanggapDarurat', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.TRX_SimulasiTanggapDarurat
    (
        sim_id              INT IDENTITY(1,1) NOT NULL,
        sim_nama            NVARCHAR(150) NOT NULL,
        sim_tanggal         DATETIME NOT NULL,
        sim_deskripsi       NVARCHAR(1000) NULL,
        sim_peserta_count   INT NOT NULL DEFAULT 0,
        sim_evaluasi        NVARCHAR(1000) NULL,
        sim_created_by      VARCHAR(50) NOT NULL,
        sim_created_date    DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT PK_TRX_SimulasiTanggapDarurat PRIMARY KEY (sim_id)
    );
END;
GO

/* ============================================================
   2. SEED DATA (MST_Role, MST_User, MST_Lantai, MST_Aset)
   ============================================================ */

-- Seed 12 Role Matrix ke MST_Role
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'MST_Role')
BEGIN
    UPDATE dbo.MST_Role SET rol_code = 'KEPALA_TKTD', rol_name = 'Kepala TKTD' WHERE rol_code = 'KEPALA_KTID';

    IF NOT EXISTS (SELECT 1 FROM dbo.MST_Role WHERE rol_code = 'SUPER_ADMIN')
        INSERT INTO dbo.MST_Role (rol_code, rol_name, rol_status, rol_created_by) VALUES ('SUPER_ADMIN', 'Super Administrator', 'Aktif', 'SYSTEM');

    IF NOT EXISTS (SELECT 1 FROM dbo.MST_Role WHERE rol_code = 'CIVITAS')
        INSERT INTO dbo.MST_Role (rol_code, rol_name, rol_status, rol_created_by) VALUES ('CIVITAS', 'Civitas ASTRAtech', 'Aktif', 'SYSTEM');

    IF NOT EXISTS (SELECT 1 FROM dbo.MST_Role WHERE rol_code = 'TIM_IDENTIFIKASI')
        INSERT INTO dbo.MST_Role (rol_code, rol_name, rol_status, rol_created_by) VALUES ('TIM_IDENTIFIKASI', 'Tim Identifikasi Kejadian Darurat', 'Aktif', 'SYSTEM');

    IF NOT EXISTS (SELECT 1 FROM dbo.MST_Role WHERE rol_code = 'PIC_CONTROL_ROOM')
        INSERT INTO dbo.MST_Role (rol_code, rol_name, rol_status, rol_created_by) VALUES ('PIC_CONTROL_ROOM', 'PIC Control Room', 'Aktif', 'SYSTEM');

    IF NOT EXISTS (SELECT 1 FROM dbo.MST_Role WHERE rol_code = 'FLOOR_WARDEN')
        INSERT INTO dbo.MST_Role (rol_code, rol_name, rol_status, rol_created_by) VALUES ('FLOOR_WARDEN', 'PIC Lantai (Floor Warden)', 'Aktif', 'SYSTEM');

    IF NOT EXISTS (SELECT 1 FROM dbo.MST_Role WHERE rol_code = 'PIC_ASSEMBLY_POINT')
        INSERT INTO dbo.MST_Role (rol_code, rol_name, rol_status, rol_created_by) VALUES ('PIC_ASSEMBLY_POINT', 'PIC Assembly Point', 'Aktif', 'SYSTEM');

    IF NOT EXISTS (SELECT 1 FROM dbo.MST_Role WHERE rol_code = 'TIM_P3K')
        INSERT INTO dbo.MST_Role (rol_code, rol_name, rol_status, rol_created_by) VALUES ('TIM_P3K', 'Tim Pertolongan Pertama (P3K)', 'Aktif', 'SYSTEM');

    IF NOT EXISTS (SELECT 1 FROM dbo.MST_Role WHERE rol_code = 'TIM_FIRE_FIGHTER')
        INSERT INTO dbo.MST_Role (rol_code, rol_name, rol_status, rol_created_by) VALUES ('TIM_FIRE_FIGHTER', 'Tim Fire Fighter', 'Aktif', 'SYSTEM');

    IF NOT EXISTS (SELECT 1 FROM dbo.MST_Role WHERE rol_code = 'PIC_RUANG_POMPA')
        INSERT INTO dbo.MST_Role (rol_code, rol_name, rol_status, rol_created_by) VALUES ('PIC_RUANG_POMPA', 'PIC Ruang Pompa', 'Aktif', 'SYSTEM');

    IF NOT EXISTS (SELECT 1 FROM dbo.MST_Role WHERE rol_code = 'KEPALA_TKTD')
        INSERT INTO dbo.MST_Role (rol_code, rol_name, rol_status, rol_created_by) VALUES ('KEPALA_TKTD', 'Kepala TKTD', 'Aktif', 'SYSTEM');

    IF NOT EXISTS (SELECT 1 FROM dbo.MST_Role WHERE rol_code = 'UNIT_K3')
        INSERT INTO dbo.MST_Role (rol_code, rol_name, rol_status, rol_created_by) VALUES ('UNIT_K3', 'Unit K3 dan Tanggung Jawab Sosial', 'Aktif', 'SYSTEM');

    IF NOT EXISTS (SELECT 1 FROM dbo.MST_Role WHERE rol_code = 'GA')
        INSERT INTO dbo.MST_Role (rol_code, rol_name, rol_status, rol_created_by) VALUES ('GA', 'GA', 'Aktif', 'SYSTEM');

    IF NOT EXISTS (SELECT 1 FROM dbo.MST_Role WHERE rol_code = 'SHE_AGENT')
        INSERT INTO dbo.MST_Role (rol_code, rol_name, rol_status, rol_created_by) VALUES ('SHE_AGENT', 'SHE Agent (Pengelola Aset)', 'Aktif', 'SYSTEM');
END;
GO

-- Seed Super Admin User di MST_User
IF NOT EXISTS (SELECT 1 FROM dbo.MST_User WHERE use_username = 'superadmin')
BEGIN
    DECLARE @rolId INT;
    SELECT @rolId = rol_id FROM dbo.MST_Role WHERE rol_code = 'SUPER_ADMIN';

    INSERT INTO dbo.MST_User (use_username, use_password_hash, use_nama, use_email, use_no_hp, use_status, use_is_deleted, rol_id, use_created_by, use_created_date)
    VALUES ('superadmin', 'superadmin', 'Super Administrator', 'superadmin@polytechnic.astra.ac.id', '081234567890', 'Aktif', 0, @rolId, 'SYSTEM', GETDATE());
END;
GO

-- Seed Data Master Lantai di MST_Lantai
IF NOT EXISTS (SELECT 1 FROM dbo.MST_Lantai)
BEGIN
    INSERT INTO dbo.MST_Lantai (lan_gedung, lan_nama_lantai, lan_urutan, lan_status, lan_created_by)
    VALUES
    ('Gedung A', 'Lantai 1', 1, 'Aktif', 'SYSTEM'),
    ('Gedung A', 'Lantai 2', 2, 'Aktif', 'SYSTEM'),
    ('Gedung A', 'Lantai 3', 3, 'Aktif', 'SYSTEM'),
    ('Gedung B', 'Lantai 1', 4, 'Aktif', 'SYSTEM'),
    ('Gedung B', 'Lantai 2', 5, 'Aktif', 'SYSTEM'),
    ('Gedung C', 'Lantai 1', 6, 'Aktif', 'SYSTEM');
END;
GO

-- Seed Data Inventaris Lengkap Aset (APAR, Hydrant Box, Emergency Box, Pompa Hydrant, APD)
IF NOT EXISTS (SELECT 1 FROM dbo.MST_Aset)
BEGIN
    DECLARE @now DATETIME = GETDATE();

    INSERT INTO dbo.MST_Aset
        (ase_id, ase_tipe, ase_lokasi, ase_detail, ase_expired_date, ase_status, ase_last_inspeksi, ase_is_deleted, ase_created_by, ase_created_date)
    VALUES
    -- APAR LANTAI G
    ('A - CAGF - 01', 'APAR', 'Pintu Masuk TPM 1 (Lantai G)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CAGF - 02', 'APAR', 'Pintu Masuk TPM 2 (Lantai G)', 'APAR Powder, 6 Kg', '2027-03-23', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CAGF - 03', 'APAR', 'CNC TPM (Lantai G)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CAGF - 04', 'APAR', 'Welding TPM (Lantai G)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CAGF - 05', 'APAR', 'Plastik Injeksi TPM (Lantai G)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CAGF - 06', 'APAR', 'UPT TPM (Lantai G)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CAGF - 07', 'APAR', 'Workshop P3P (Lantai G)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CAGF - 08', 'APAR', 'CNC P3P 1 (Lantai G)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CAGF - 09', 'APAR', 'Workshop P3P 2 (Lantai G)', 'APAR Powder, 6 Kg', '2027-03-23', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CBGF - 01', 'APAR', 'Workhop MO 1 (Lantai G)', 'APAR Powder, 6 Kg', '2027-03-23', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CBGF - 02', 'APAR', 'Kelas Elektrik MO (Lantai G)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CBGF - 03', 'APAR', 'Workshop MO 2 (Lantai G)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CBGF - 04', 'APAR', 'Kelas Chasis MO (Lantai G)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CBGF - 05', 'APAR', 'Kelas Engine MO (Lantai G)', 'APAR Powder, 6 Kg', '2027-03-23', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CBGF - 06', 'APAR', 'Kelas Pemindah Daya MO (Lantai G)', 'APAR Powder, 6 Kg', '2027-03-23', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CBGF - 07', 'APAR', 'Meister 1 (Lantai G)', 'APAR Powder, 6 Kg', '2027-03-23', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CBGF - 08', 'APAR', 'Meister 2 (Lantai G)', 'APAR Powder, 6 Kg', '2027-03-23', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CBGF - 09', 'APAR', 'Stall Pemindah Daya TAB (Lantai G)', 'APAR Powder, 6 Kg', '2027-03-23', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CBGF - 10', 'APAR', 'Stall Engine TAB (Lantai G)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CBGF - 11', 'APAR', 'Stall Service TAB (Lantai G)', 'APAR Powder, 6 Kg', '2027-03-23', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CBGF - 12', 'APAR', 'Test Bench TAB (Lantai G)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CBGF - 13', 'APAR', 'Kelas Meister (Lantai G)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CCGF - 01', 'APAR', 'Ruang Panel Gedung C (Lantai G)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CCGF - 02', 'APAR', 'Kelas Belakang Meister (Lantai G)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CCGF - 03', 'APAR', 'Workshop TKBG 1 (Lantai G)', 'APAR Powder, 6 Kg', '2027-03-23', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CCGF - 04', 'APAR', 'Workshop TKBG 2 (Lantai G)', 'APAR Powder, 6 Kg', '2027-03-23', 'Aman', @now, 0, 'SYSTEM', @now),

    -- APAR LANTAI 1
    ('A - CA1F - 01', 'APAR', 'LAB CAM (Lantai 1)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CA1F - 02', 'APAR', 'LAB PERANCANGAN SISTEM KERJA (Lantai 1)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CA1F - 03', 'APAR', 'LAB OTOMASI INDUSTRI (Lantai 1)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CA1F - 04', 'APAR', 'LAB SENSOR AKTUATOR (Lantai 1)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CA1F - 05', 'APAR', 'PANEL ROOM KOMUNAL INOVASI (Lantai 1)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CA1F - 06', 'APAR', 'KOMUNAL INOVASI (Lantai 1)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A- CB1F - 01', 'APAR', 'LAB SISTEM INTEGRASI (Lantai 1)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A- CB1F - 02', 'APAR', 'LAB PROGRAMMING (Lantai 1)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A- CB1F - 03', 'APAR', 'LAB SOFTWARE DEVELOPMENT (Lantai 1)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CC1F - 01', 'APAR', 'KOMUNAL INTEGRITAS (Lantai 1)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CC1F - 02', 'APAR', 'PANEL ROOM KOMUNAL INTEGRITAS (Lantai 1)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CC1F - 03', 'APAR', 'MUSHOLA (Lantai 1)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CC1F - 04', 'APAR', 'DINING ROOM (Lantai 1)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CD1F - 01', 'APAR', 'UPT TRPL ( MI ) (Lantai 1)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CD1F - 02', 'APAR', 'KOMUNAL A STAR (Lantai 1)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CD1F - 03', 'APAR', 'KOMUNAL A STAR (Lantai 1)', 'APAR Powder, 6 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CD1F - 04', 'APAR', 'DEKAT LP2M (Lantai 1)', 'APAR CO2, 5 Kg', '2027-03-23', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CD1F - 05', 'APAR', 'DEPAN UPT TRL (Lantai 1)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),

    -- APAR LANTAI 2
    ('A - CA2F - 01', 'APAR', 'Depan Ruang Yayasan (Lantai 2)', 'APAR CO2, 5 Kg', '2027-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CA2F - 02', 'APAR', 'Depan Ruang DAAA (Lantai 2)', 'APAR CO2, 5 Kg', '2027-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CA2F - 03', 'APAR', 'Panel Dalam DAAA (Lantai 2)', 'APAR CO2, 5 Kg', '2027-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CA2F - 04', 'APAR', 'Depan Ruang Rapat 1 (Lantai 2)', 'APAR CO2, 5 Kg', '2027-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CA2F - 05', 'APAR', 'Depan Ruang Podcast (Lantai 2)', 'APAR CO2, 5 Kg', '2027-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CA2F - 06', 'APAR', 'Panel Gedung A (Lantai 2)', 'APAR CO2, 5 Kg', '2027-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CA2F - 07', 'APAR', 'Komunal Tangguh (Lantai 2)', 'APAR CO2, 5 Kg', '2027-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CB2F - 01', 'APAR', 'Depan Gudang (Lantai 2)', 'APAR Powder, 6 Kg', '2027-03-23', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CB2F - 02', 'APAR', 'Depan CB 207 (Lantai 2)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CB2F - 03', 'APAR', 'Depan CB 215 (Lantai 2)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CC2F - 01', 'APAR', 'Komunal Handal (Lantai 2)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CC2F - 02', 'APAR', 'Panel Gedung C (Lantai 2)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CC2F - 03', 'APAR', 'Depan CC 207 (Lantai 2)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CD2F - 01', 'APAR', 'Depan Kelas CD 204 (Lantai 2)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CD2F - 02', 'APAR', 'Komunal Kolaborasi (Lantai 2)', 'APAR Powder, 6 Kg', '2027-03-23', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CD2F - 03', 'APAR', 'Komunal Kolaorasi (Lantai 2)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CD2F - 04', 'APAR', 'Dalam Perpustakaan (Lantai 2)', 'APAR CO2, 5 Kg', '2026-11-08', 'Aman', @now, 0, 'SYSTEM', @now),
    ('A - CD2F - 05', 'APAR', 'Depan Gudang GA (Lantai 2)', 'APAR Powder, 6 Kg', '2027-03-23', 'Aman', @now, 0, 'SYSTEM', @now),

    -- HYDRANT BOX (GEDUNG, DORMITORY, YARD)
    ('H - CAGF - 01', 'HYDRANT_BOX', 'Depan CNC TPM (Lantai G)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CAGF - 02', 'HYDRANT_BOX', 'Plastik Injeksi TPM (Lantai G)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CAGF - 03', 'HYDRANT_BOX', 'Workshop P3P 1 (Lantai G)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CAGF - 04', 'HYDRANT_BOX', 'Workshop P3P 2 (Lantai G)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CAGF - 05', 'HYDRANT_BOX', 'HOA (Lantai G)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CBGF - 01', 'HYDRANT_BOX', 'Workshop MO (Lantai G)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CBGF - 02', 'HYDRANT_BOX', 'Depan Test Bench TAB (Lantai G)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CCGF - 01', 'HYDRANT_BOX', 'Samping Control Panel (Lantai G)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CCGF - 02', 'HYDRANT_BOX', 'Workshop TKBG (Lantai G)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CCGF - 03', 'HYDRANT_BOX', 'Samping Klinik (Lantai G)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),

    ('H - CA1F - 01', 'HYDRANT_BOX', 'Samping Lab Transportasi dan Distribusi (Lantai 1)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CA1F - 02', 'HYDRANT_BOX', 'Komunal Inovasi (Lantai 1)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CB1F - 01', 'HYDRANT_BOX', 'Lab Database (Lantai 1)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CB1F - 02', 'HYDRANT_BOX', 'Komunal Integritas (Lantai 1)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CC1F - 01', 'HYDRANT_BOX', 'Komunal Kolaborasi (Lantai 1)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CC1F - 02', 'HYDRANT_BOX', 'Depan Masjid (Lantai 1)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CD1F - 01', 'HYDRANT_BOX', 'Depan UPT MI (Lantai 1)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CD1F - 02', 'HYDRANT_BOX', 'Samping LP2M (Lantai 1)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CD1F - 03', 'HYDRANT_BOX', 'Komunal Astar (Lantai 1)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),

    ('H - CA2F - 01', 'HYDRANT_BOX', 'Depan Direksi (Lantai 2)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CA2F - 02', 'HYDRANT_BOX', 'Gedung A Koridor (Lantai 2)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CA2F - 03', 'HYDRANT_BOX', 'Komunal Tangguh (Lantai 2)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CB2F - 01', 'HYDRANT_BOX', 'Samping CB 207 (Lantai 2)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CB2F - 02', 'HYDRANT_BOX', 'Komunal Handal (Lantai 2)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CC2F - 01', 'HYDRANT_BOX', 'Samping CC 207 (Lantai 2)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CD2F - 01', 'HYDRANT_BOX', 'Samping CD 202 (Lantai 2)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('H - CD2F - 02', 'HYDRANT_BOX', 'Gedung D Koridor (Lantai 2)', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', @now, 0, 'SYSTEM', @now),

    ('DLGF - H - 01', 'HYDRANT_BOX', 'Parkiran Karyawan Pintu Masuk (Lantai LG Dormitory)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('DLGF - H - 02', 'HYDRANT_BOX', 'Parkiran Karyawan Pintu Keluar (Lantai LG Dormitory)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('DLGF - H - 03', 'HYDRANT_BOX', 'Parkiran Mahasiswa (Lantai LG Dormitory)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('DLGF - H - 04', 'HYDRANT_BOX', 'Samping Lift (Lantai LG Dormitory)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),

    ('DGF - H - 01', 'HYDRANT_BOX', 'Lantai G 1 (Dormitory)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('DGF - H - 02', 'HYDRANT_BOX', 'Samping Mini Market (Dormitory G)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('DGF - H - 03', 'HYDRANT_BOX', 'Lantai G 2 (Dormitory)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),

    ('D1F - H - 01', 'HYDRANT_BOX', 'Samping Lift (Dormitory Lantai 1)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D1F - H - 02', 'HYDRANT_BOX', 'Area Pantry (Dormitory Lantai 1)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D2F - H - 01', 'HYDRANT_BOX', 'Samping Lift (Dormitory Lantai 2)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D2F - H - 02', 'HYDRANT_BOX', 'Samping Pantry (Dormitory Lantai 2)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D3F - H - 01', 'HYDRANT_BOX', 'Samping Lift (Dormitory Lantai 3)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D3F - H - 02', 'HYDRANT_BOX', 'Samping Pantry (Dormitory Lantai 3)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D4F - H - 01', 'HYDRANT_BOX', 'Samping Lift (Dormitory Lantai 4)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D4F - H - 02', 'HYDRANT_BOX', 'Samping Pantry (Dormitory Lantai 4)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D5F - H - 01', 'HYDRANT_BOX', 'Samping Lift (Dormitory Lantai 5)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D5F - H - 02', 'HYDRANT_BOX', 'Samping Pantry (Dormitory Lantai 5)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D6F - H - 01', 'HYDRANT_BOX', 'Samping Lift (Dormitory Lantai 6)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D6F - H - 02', 'HYDRANT_BOX', 'Samping Pantry (Dormitory Lantai 6)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D7F - H - 01', 'HYDRANT_BOX', 'Samping Lift (Dormitory Lantai 7)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D7F - H - 02', 'HYDRANT_BOX', 'Samping Pantry (Dormitory Lantai 7)', 'Hydrant Box Indoor, Selang 30m', NULL, 'Aman', @now, 0, 'SYSTEM', @now),

    ('CY - H - 01', 'HYDRANT_BOX', 'Parkiran Timur 1 (Outdoor Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 02', 'HYDRANT_BOX', 'Parkiran Timur 2 (Outdoor Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 03', 'HYDRANT_BOX', 'Samping Plaza 1 (Outdoor Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 04', 'HYDRANT_BOX', 'Samping Plaza 2 (Outdoor Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 05', 'HYDRANT_BOX', 'Samping Toilet Loby Kampus (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 06', 'HYDRANT_BOX', 'Samping Workshop CNC TPM (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 07', 'HYDRANT_BOX', 'Samping UPT P3P (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 08', 'HYDRANT_BOX', 'Samping Workshop MO (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 09', 'HYDRANT_BOX', 'Pintu Keluar Barat (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 10', 'HYDRANT_BOX', 'Belakang UPT AB (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 11', 'HYDRANT_BOX', 'Pintu Masuk Barat (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 12', 'HYDRANT_BOX', 'Samping TKBG 1 (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 13', 'HYDRANT_BOX', 'Samping TKBG 2 (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 14', 'HYDRANT_BOX', 'Samping Plang Astratech (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 15', 'HYDRANT_BOX', 'Pos Utama Satpam (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 16', 'HYDRANT_BOX', 'Samping Pos Utama (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 17', 'HYDRANT_BOX', 'Samping Pintu Keluar Selatan (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 18', 'HYDRANT_BOX', 'Area Lapangan Utama (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 19', 'HYDRANT_BOX', 'Tikungan Timur (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 20', 'HYDRANT_BOX', 'Parkiran Timur (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 21', 'HYDRANT_BOX', 'Samping Lapangan Voli (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 22', 'HYDRANT_BOX', 'Depan Lorong Pintu Masuk TPM (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 23', 'HYDRANT_BOX', 'Loby Masuk Kampus (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CY - H - 24', 'HYDRANT_BOX', 'Lapangan Voli Utara (Yard)', 'Hydrant Box Outdoor / Pillar', NULL, 'Aman', @now, 0, 'SYSTEM', @now),

    -- EMERGENCY BOX
    ('CGF - EB - A - 01', 'EMERGENCY_BOX', 'Welding TPM (Gedung A Lantai G)', 'Kotak Emergency Lengkap, Tandu, P3K', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CGF - EB - B - 01', 'EMERGENCY_BOX', 'CNC P3P (Gedung B Lantai G)', 'Kotak Emergency Lengkap, Tandu, P3K', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CGF - EB - C - 01', 'EMERGENCY_BOX', 'Workshop MO (Gedung C Lantai G)', 'Kotak Emergency Lengkap, Tandu, P3K', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('CGF - EB - D - 01', 'EMERGENCY_BOX', 'Workshop TKBG (Gedung D Lantai G)', 'Kotak Emergency Lengkap, Tandu, P3K', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('C1F - EB - A - 01', 'EMERGENCY_BOX', 'Samping Lab Teknik Digital (Lantai 1)', 'Kotak Emergency Lengkap, P3K, Helm Safety', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('C1F - EB - C - 01', 'EMERGENCY_BOX', 'Komunal Integritas (Lantai 1)', 'Kotak Emergency Lengkap, P3K, Helm Safety', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('C2F - EB - A - 01', 'EMERGENCY_BOX', 'Depan Perpustakaan (Lantai 2)', 'Kotak Emergency Lengkap, P3K, Rompi Safety', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('C2F - EB - C - 01', 'EMERGENCY_BOX', 'Komunal Handal (Lantai 2)', 'Kotak Emergency Lengkap, P3K, Rompi Safety', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('C3F - EB - A - 01', 'EMERGENCY_BOX', 'Gedung A (Lantai 3)', 'Kotak Emergency Lengkap', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('C3F - EB - C - 01', 'EMERGENCY_BOX', 'Gedung C (Lantai 3)', 'Kotak Emergency Lengkap', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('C4F - EB - A - 01', 'EMERGENCY_BOX', 'Gedung A (Lantai 4)', 'Kotak Emergency Lengkap', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('C4F - EB - C - 01', 'EMERGENCY_BOX', 'Gedung C (Lantai 4)', 'Kotak Emergency Lengkap', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('DLGF - EB - 01', 'EMERGENCY_BOX', 'Parkiran Dormitory 1 (Gedung Dormitory LG)', 'Kotak Emergency Lengkap', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('DLGF - EB - 02', 'EMERGENCY_BOX', 'Parkiran Dormitory 2 (Gedung Dormitory LG)', 'Kotak Emergency Lengkap', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('DGF - EB - 01', 'EMERGENCY_BOX', 'Lobby Dormitory 1 (Gedung Dormitory G)', 'Kotak Emergency Lengkap', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('DGF - EB - 02', 'EMERGENCY_BOX', 'Lobby Dormitory 2 (Gedung Dormitory G)', 'Kotak Emergency Lengkap', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D1F - EB - 01', 'EMERGENCY_BOX', 'Gedung Dormitory (Lantai 1)', 'Kotak Emergency Lengkap', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D2F - EB - 01', 'EMERGENCY_BOX', 'Gedung Dormitory (Lantai 2)', 'Kotak Emergency Lengkap', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D3F - EB - 01', 'EMERGENCY_BOX', 'Gedung Dormitory (Lantai 3)', 'Kotak Emergency Lengkap', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D4F - EB - 01', 'EMERGENCY_BOX', 'Gedung Dormitory (Lantai 4)', 'Kotak Emergency Lengkap', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D5F - EB - 01', 'EMERGENCY_BOX', 'Gedung Dormitory (Lantai 5)', 'Kotak Emergency Lengkap', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D6F - EB - 01', 'EMERGENCY_BOX', 'Gedung Dormitory (Lantai 6)', 'Kotak Emergency Lengkap', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('D7F - EB - 01', 'EMERGENCY_BOX', 'Gedung Dormitory (Lantai 7)', 'Kotak Emergency Lengkap', NULL, 'Aman', @now, 0, 'SYSTEM', @now),

    -- POMPA HYDRANT
    ('PMP - RPU - 01', 'POMPA_HYDRANT', 'Rumah Pompa Utama', 'Pompa Hydrant Utama - Diesel Engine, 500 GPM', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('PMP - RPU - 02', 'POMPA_HYDRANT', 'Rumah Pompa Utama', 'Pompa Electric Utama - Motor Electric, 500 GPM', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('PMP - RPU - 03', 'POMPA_HYDRANT', 'Rumah Pompa Utama', 'Pompa Jockey Hydrant - Electric Motor, 50 GPM', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('PMP - RPD - 01', 'POMPA_HYDRANT', 'Rumah Pompa Dormitory', 'Pompa Standby Dormitory - Electric Motor, 250 GPM', NULL, 'Aman', @now, 0, 'SYSTEM', @now),

    -- APD BOX
    ('APD - CAGF - 01', 'APD', 'Gedung A - Pos Utama Satpam', 'APD Atasan, Celana, Sepatu Safety, Helm Safety (8 Set)', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('APD - CB1F - 01', 'APD', 'Gedung B - Control Room', 'APD SCBA 6L, Helm Damkar, Baju Tahan Api (8 Set)', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('APD - CCGF - 01', 'APD', 'Gedung C - Ruang K3 / Klinik', 'APD Atasan, Celana, Sepatu Safety, Helm Safety (8 Set)', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
    ('APD - DGF - 01', 'APD', 'Gedung Dormitory - Pos Satpam Dormitory', 'APD Fire Fighter Set, Helm Safety (8 Set)', NULL, 'Aman', @now, 0, 'SYSTEM', @now);
END;
GO

/* ============================================================
   3. STORED PROCEDURES (49 PROCEDURES)
   ============================================================ */

/* ---------- 1. USE_MST (Auth / User) ---------- */
IF OBJECT_ID('dbo.USE_MST_GetByUsername', 'P') IS NOT NULL DROP PROCEDURE dbo.USE_MST_GetByUsername;
GO
CREATE PROCEDURE dbo.USE_MST_GetByUsername
    @Username VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        u.use_id             AS user_id,
        u.use_username       AS username,
        u.use_password_hash  AS password_hash,
        u.use_nama           AS nama,
        u.use_email          AS email,
        u.use_no_hp          AS no_hp,
        u.rol_id             AS role_id,
        r.rol_code           AS role_code,
        r.rol_name           AS role_name,
        CAST(CASE WHEN u.use_status = 'Aktif' THEN 1 ELSE 0 END AS BIT) AS is_active
    FROM dbo.MST_User u
    INNER JOIN dbo.MST_Role r ON r.rol_id = u.rol_id
    WHERE u.use_username = @Username
      AND u.use_status = 'Aktif'
      AND u.use_is_deleted = 0;
END;
GO

IF OBJECT_ID('dbo.USE_MST_GetById', 'P') IS NOT NULL DROP PROCEDURE dbo.USE_MST_GetById;
GO
CREATE PROCEDURE dbo.USE_MST_GetById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        u.use_id             AS user_id,
        u.use_username       AS username,
        u.use_password_hash  AS password_hash,
        u.use_nama           AS nama,
        u.use_email          AS email,
        u.use_no_hp          AS no_hp,
        u.rol_id             AS role_id,
        r.rol_code           AS role_code,
        r.rol_name           AS role_name,
        CAST(CASE WHEN u.use_status = 'Aktif' THEN 1 ELSE 0 END AS BIT) AS is_active
    FROM dbo.MST_User u
    INNER JOIN dbo.MST_Role r ON r.rol_id = u.rol_id
    WHERE u.use_id = @Id
      AND u.use_is_deleted = 0;
END;
GO

IF OBJECT_ID('dbo.USE_MST_GetByRoleCode', 'P') IS NOT NULL DROP PROCEDURE dbo.USE_MST_GetByRoleCode;
GO
CREATE PROCEDURE dbo.USE_MST_GetByRoleCode
    @RoleCode VARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        u.use_id             AS user_id,
        u.use_username       AS username,
        u.use_password_hash  AS password_hash,
        u.use_nama           AS nama,
        u.use_email          AS email,
        u.use_no_hp          AS no_hp,
        u.rol_id             AS role_id,
        r.rol_code           AS role_code,
        r.rol_name           AS role_name,
        CAST(CASE WHEN u.use_status = 'Aktif' THEN 1 ELSE 0 END AS BIT) AS is_active
    FROM dbo.MST_User u
    INNER JOIN dbo.MST_Role r ON r.rol_id = u.rol_id
    WHERE r.rol_code = @RoleCode
      AND u.use_status = 'Aktif'
      AND u.use_is_deleted = 0;
END;
GO

IF OBJECT_ID('dbo.USE_MST_CountActiveByRoleCode', 'P') IS NOT NULL DROP PROCEDURE dbo.USE_MST_CountActiveByRoleCode;
GO
CREATE PROCEDURE dbo.USE_MST_CountActiveByRoleCode
    @RoleCode VARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT COUNT(1) AS total
    FROM dbo.MST_User u
    INNER JOIN dbo.MST_Role r ON r.rol_id = u.rol_id
    WHERE r.rol_code = @RoleCode
      AND u.use_status = 'Aktif'
      AND u.use_is_deleted = 0;
END;
GO

/* ---------- 2. LAN_MST (Lantai) ---------- */
IF OBJECT_ID('dbo.LAN_MST_GetAllActive', 'P') IS NOT NULL DROP PROCEDURE dbo.LAN_MST_GetAllActive;
GO
CREATE PROCEDURE dbo.LAN_MST_GetAllActive
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        lan_id          AS lantai_id,
        lan_gedung      AS gedung,
        lan_nama_lantai AS nama_lantai,
        lan_urutan      AS urutan
    FROM dbo.MST_Lantai
    WHERE lan_status = 'Aktif' AND lan_is_deleted = 0
    ORDER BY lan_urutan;
END;
GO

/* ---------- 3. KEJ_TRX (Kejadian) ---------- */
IF OBJECT_ID('dbo.KEJ_TRX_Create', 'P') IS NOT NULL DROP PROCEDURE dbo.KEJ_TRX_Create;
GO
CREATE PROCEDURE dbo.KEJ_TRX_Create
    @KodeKejadian    VARCHAR(20),
    @JenisKejadian   NVARCHAR(50),
    @Lokasi          NVARCHAR(200),
    @Deskripsi       NVARCHAR(1000) = NULL,
    @FotoUrl         NVARCHAR(300) = NULL,
    @UserIdPelapor   INT,
    @CreatedBy       VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.TRX_Kejadian
        (kej_kode_kejadian, kej_jenis_kejadian, kej_lokasi, kej_deskripsi, kej_foto_url,
         kej_status, use_id_pelapor, kej_waktu_lapor, kej_created_by, kej_created_date)
    VALUES
        (@KodeKejadian, @JenisKejadian, @Lokasi, @Deskripsi, @FotoUrl,
         'Menunggu Validasi', @UserIdPelapor, GETDATE(), @CreatedBy, GETDATE());

    SELECT SCOPE_IDENTITY() AS kejadian_id;
END;
GO

IF OBJECT_ID('dbo.KEJ_TRX_GetData', 'P') IS NOT NULL DROP PROCEDURE dbo.KEJ_TRX_GetData;
GO
CREATE PROCEDURE dbo.KEJ_TRX_GetData
    @Status     VARCHAR(30) = NULL,
    @Halaman    INT = 1,
    @Limit      INT = 20
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Offset INT = (@Halaman - 1) * @Limit;

    SELECT
        k.kej_id                        AS kejadian_id,
        k.kej_kode_kejadian              AS kode_kejadian,
        k.kej_jenis_kejadian             AS jenis_kejadian,
        k.kej_lokasi                     AS lokasi,
        k.kej_deskripsi                  AS deskripsi,
        k.kej_foto_url                   AS foto_url,
        k.kej_status                     AS status,
        k.use_id_pelapor                 AS dilaporkan_oleh_user_id,
        ulapor.use_nama                  AS dilaporkan_oleh_nama,
        k.kej_waktu_lapor                AS waktu_lapor,
        k.use_id_validator               AS divalidasi_oleh_user_id,
        uval.use_nama                    AS divalidasi_oleh_nama,
        k.kej_waktu_validasi             AS waktu_validasi,
        k.kej_hasil_validasi             AS hasil_validasi,
        k.kej_catatan_validasi           AS catatan_validasi,
        k.kej_waktu_pengumuman_darurat   AS waktu_pengumuman_darurat,
        k.kej_waktu_pengumuman_aman      AS waktu_pengumuman_aman,
        k.kej_waktu_ditetapkan_aman      AS waktu_ditetapkan_aman
    FROM dbo.TRX_Kejadian k
    INNER JOIN dbo.MST_User ulapor ON ulapor.use_id = k.use_id_pelapor
    LEFT JOIN dbo.MST_User uval ON uval.use_id = k.use_id_validator
    WHERE (@Status IS NULL OR k.kej_status = @Status)
    ORDER BY k.kej_waktu_lapor DESC
    OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY;

    SELECT COUNT(1) AS total
    FROM dbo.TRX_Kejadian k
    WHERE (@Status IS NULL OR k.kej_status = @Status);
END;
GO

IF OBJECT_ID('dbo.KEJ_TRX_Detail', 'P') IS NOT NULL DROP PROCEDURE dbo.KEJ_TRX_Detail;
GO
CREATE PROCEDURE dbo.KEJ_TRX_Detail
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        k.kej_id                        AS kejadian_id,
        k.kej_kode_kejadian              AS kode_kejadian,
        k.kej_jenis_kejadian             AS jenis_kejadian,
        k.kej_lokasi                     AS lokasi,
        k.kej_deskripsi                  AS deskripsi,
        k.kej_foto_url                   AS foto_url,
        k.kej_status                     AS status,
        k.use_id_pelapor                 AS dilaporkan_oleh_user_id,
        ulapor.use_nama                  AS dilaporkan_oleh_nama,
        k.kej_waktu_lapor                AS waktu_lapor,
        k.use_id_validator               AS divalidasi_oleh_user_id,
        uval.use_nama                    AS divalidasi_oleh_nama,
        k.kej_waktu_validasi             AS waktu_validasi,
        k.kej_hasil_validasi             AS hasil_validasi,
        k.kej_catatan_validasi           AS catatan_validasi,
        k.kej_waktu_pengumuman_darurat   AS waktu_pengumuman_darurat,
        k.kej_waktu_pengumuman_aman      AS waktu_pengumuman_aman,
        k.kej_waktu_ditetapkan_aman      AS waktu_ditetapkan_aman
    FROM dbo.TRX_Kejadian k
    INNER JOIN dbo.MST_User ulapor ON ulapor.use_id = k.use_id_pelapor
    LEFT JOIN dbo.MST_User uval ON uval.use_id = k.use_id_validator
    WHERE k.kej_id = @Id;
END;
GO

IF OBJECT_ID('dbo.KEJ_TRX_GetAktif', 'P') IS NOT NULL DROP PROCEDURE dbo.KEJ_TRX_GetAktif;
GO
CREATE PROCEDURE dbo.KEJ_TRX_GetAktif
AS
BEGIN
    SET NOCOUNT ON;
    SELECT TOP (1)
        k.kej_id                        AS kejadian_id,
        k.kej_kode_kejadian              AS kode_kejadian,
        k.kej_jenis_kejadian             AS jenis_kejadian,
        k.kej_lokasi                     AS lokasi,
        k.kej_deskripsi                  AS deskripsi,
        k.kej_foto_url                   AS foto_url,
        k.kej_status                     AS status,
        k.use_id_pelapor                 AS dilaporkan_oleh_user_id,
        ulapor.use_nama                  AS dilaporkan_oleh_nama,
        k.kej_waktu_lapor                AS waktu_lapor,
        k.use_id_validator               AS divalidasi_oleh_user_id,
        uval.use_nama                    AS divalidasi_oleh_nama,
        k.kej_waktu_validasi             AS waktu_validasi,
        k.kej_hasil_validasi             AS hasil_validasi,
        k.kej_catatan_validasi           AS catatan_validasi,
        k.kej_waktu_pengumuman_darurat   AS waktu_pengumuman_darurat,
        k.kej_waktu_pengumuman_aman      AS waktu_pengumuman_aman,
        k.kej_waktu_ditetapkan_aman      AS waktu_ditetapkan_aman
    FROM dbo.TRX_Kejadian k
    INNER JOIN dbo.MST_User ulapor ON ulapor.use_id = k.use_id_pelapor
    LEFT JOIN dbo.MST_User uval ON uval.use_id = k.use_id_validator
    WHERE k.kej_status NOT IN ('Selesai', 'Bukan Darurat')
    ORDER BY k.kej_waktu_lapor DESC;
END;
GO

IF OBJECT_ID('dbo.KEJ_TRX_Validasi', 'P') IS NOT NULL DROP PROCEDURE dbo.KEJ_TRX_Validasi;
GO
CREATE PROCEDURE dbo.KEJ_TRX_Validasi
    @Id             INT,
    @HasilValidasi  BIT,
    @Catatan        NVARCHAR(500) = NULL,
    @UserId         INT,
    @ModifiedBy     VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @NewStatus VARCHAR(30) = CASE WHEN @HasilValidasi = 1 THEN 'Tervalidasi' ELSE 'Bukan Darurat' END;

    UPDATE dbo.TRX_Kejadian
    SET kej_status = @NewStatus,
        kej_hasil_validasi = @HasilValidasi,
        kej_catatan_validasi = @Catatan,
        use_id_validator = @UserId,
        kej_waktu_validasi = GETDATE(),
        kej_modified_by = @ModifiedBy,
        kej_modified_date = GETDATE()
    WHERE kej_id = @Id AND kej_status = 'Menunggu Validasi';

    SELECT @@ROWCOUNT AS affected;
END;
GO

IF OBJECT_ID('dbo.KEJ_TRX_PengumumanDarurat', 'P') IS NOT NULL DROP PROCEDURE dbo.KEJ_TRX_PengumumanDarurat;
GO
CREATE PROCEDURE dbo.KEJ_TRX_PengumumanDarurat
    @Id          INT,
    @UserId      INT,
    @ModifiedBy  VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.TRX_Kejadian
    SET kej_status = 'Diumumkan',
        use_id_pengumum = @UserId,
        kej_waktu_pengumuman_darurat = GETDATE(),
        kej_modified_by = @ModifiedBy,
        kej_modified_date = GETDATE()
    WHERE kej_id = @Id AND kej_status = 'Tervalidasi';

    SELECT @@ROWCOUNT AS affected;
END;
GO

IF OBJECT_ID('dbo.KEJ_TRX_PengumumanAman', 'P') IS NOT NULL DROP PROCEDURE dbo.KEJ_TRX_PengumumanAman;
GO
CREATE PROCEDURE dbo.KEJ_TRX_PengumumanAman
    @Id          INT,
    @ModifiedBy  VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.TRX_Kejadian
    SET kej_waktu_pengumuman_aman = GETDATE(),
        kej_modified_by = @ModifiedBy,
        kej_modified_date = GETDATE()
    WHERE kej_id = @Id AND kej_status = 'Aman';

    SELECT @@ROWCOUNT AS affected;
END;
GO

IF OBJECT_ID('dbo.KEJ_TRX_TetapkanAman', 'P') IS NOT NULL DROP PROCEDURE dbo.KEJ_TRX_TetapkanAman;
GO
CREATE PROCEDURE dbo.KEJ_TRX_TetapkanAman
    @Id          INT,
    @UserId      INT,
    @ModifiedBy  VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.TRX_Kejadian
    SET kej_status = 'Aman',
        use_id_penetap_aman = @UserId,
        kej_waktu_ditetapkan_aman = GETDATE(),
        kej_modified_by = @ModifiedBy,
        kej_modified_date = GETDATE()
    WHERE kej_id = @Id AND kej_status IN ('Assembly Point', 'Penanganan');

    SELECT @@ROWCOUNT AS affected;
END;
GO

IF OBJECT_ID('dbo.KEJ_TRX_SetStatus', 'P') IS NOT NULL DROP PROCEDURE dbo.KEJ_TRX_SetStatus;
GO
CREATE PROCEDURE dbo.KEJ_TRX_SetStatus
    @Id          INT,
    @Status      VARCHAR(30),
    @ModifiedBy  VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.TRX_Kejadian
    SET kej_status = @Status,
        kej_modified_by = @ModifiedBy,
        kej_modified_date = GETDATE()
    WHERE kej_id = @Id;

    SELECT @@ROWCOUNT AS affected;
END;
GO

IF OBJECT_ID('dbo.KEJ_TRX_Exists', 'P') IS NOT NULL DROP PROCEDURE dbo.KEJ_TRX_Exists;
GO
CREATE PROCEDURE dbo.KEJ_TRX_Exists
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT COUNT(1) AS total FROM dbo.TRX_Kejadian WHERE kej_id = @Id;
END;
GO

/* ---------- 4. EVA_TRX (EvakuasiLantai) ---------- */
IF OBJECT_ID('dbo.EVA_TRX_SeedForKejadian', 'P') IS NOT NULL DROP PROCEDURE dbo.EVA_TRX_SeedForKejadian;
GO
CREATE PROCEDURE dbo.EVA_TRX_SeedForKejadian
    @KejadianId  INT,
    @CreatedBy   VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.TRX_EvakuasiLantai (kej_id, lan_id, eva_status, eva_created_by, eva_created_date)
    SELECT @KejadianId, l.lan_id, 'Belum', @CreatedBy, GETDATE()
    FROM dbo.MST_Lantai l
    WHERE l.lan_status = 'Aktif' AND l.lan_is_deleted = 0
      AND NOT EXISTS (
          SELECT 1 FROM dbo.TRX_EvakuasiLantai e
          WHERE e.kej_id = @KejadianId AND e.lan_id = l.lan_id
      );
END;
GO

IF OBJECT_ID('dbo.EVA_TRX_GetByKejadian', 'P') IS NOT NULL DROP PROCEDURE dbo.EVA_TRX_GetByKejadian;
GO
CREATE PROCEDURE dbo.EVA_TRX_GetByKejadian
    @KejadianId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        e.eva_id              AS evakuasi_id,
        e.lan_id               AS lantai_id,
        l.lan_gedung            AS gedung,
        l.lan_nama_lantai       AS nama_lantai,
        e.eva_status            AS status,
        e.eva_waktu_instruksi   AS waktu_instruksi,
        e.eva_waktu_laporan     AS waktu_laporan,
        e.eva_catatan           AS catatan
    FROM dbo.TRX_EvakuasiLantai e
    INNER JOIN dbo.MST_Lantai l ON l.lan_id = e.lan_id
    WHERE e.kej_id = @KejadianId
    ORDER BY l.lan_urutan;
END;
GO

IF OBJECT_ID('dbo.EVA_TRX_Exists', 'P') IS NOT NULL DROP PROCEDURE dbo.EVA_TRX_Exists;
GO
CREATE PROCEDURE dbo.EVA_TRX_Exists
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT COUNT(1) AS total FROM dbo.TRX_EvakuasiLantai WHERE eva_id = @Id;
END;
GO

IF OBJECT_ID('dbo.EVA_TRX_GetKejadianId', 'P') IS NOT NULL DROP PROCEDURE dbo.EVA_TRX_GetKejadianId;
GO
CREATE PROCEDURE dbo.EVA_TRX_GetKejadianId
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT kej_id AS kejadian_id FROM dbo.TRX_EvakuasiLantai WHERE eva_id = @Id;
END;
GO

IF OBJECT_ID('dbo.EVA_TRX_Instruksi', 'P') IS NOT NULL DROP PROCEDURE dbo.EVA_TRX_Instruksi;
GO
CREATE PROCEDURE dbo.EVA_TRX_Instruksi
    @Id          INT,
    @UserId      INT,
    @ModifiedBy  VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.TRX_EvakuasiLantai
    SET eva_status = 'Sedang Evakuasi',
        use_id_instruksi = @UserId,
        eva_waktu_instruksi = GETDATE(),
        eva_modified_by = @ModifiedBy,
        eva_modified_date = GETDATE()
    WHERE eva_id = @Id AND eva_status = 'Belum';

    SELECT @@ROWCOUNT AS affected;
END;
GO

IF OBJECT_ID('dbo.EVA_TRX_Selesai', 'P') IS NOT NULL DROP PROCEDURE dbo.EVA_TRX_Selesai;
GO
CREATE PROCEDURE dbo.EVA_TRX_Selesai
    @Id          INT,
    @UserId      INT,
    @Catatan     NVARCHAR(300) = NULL,
    @ModifiedBy  VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.TRX_EvakuasiLantai
    SET eva_status = 'Kosong',
        use_id_pelapor = @UserId,
        eva_waktu_laporan = GETDATE(),
        eva_catatan = @Catatan,
        eva_modified_by = @ModifiedBy,
        eva_modified_date = GETDATE()
    WHERE eva_id = @Id AND eva_status IN ('Belum', 'Sedang Evakuasi');

    SELECT @@ROWCOUNT AS affected;
END;
GO

IF OBJECT_ID('dbo.EVA_TRX_IsAllFloorsEmpty', 'P') IS NOT NULL DROP PROCEDURE dbo.EVA_TRX_IsAllFloorsEmpty;
GO
CREATE PROCEDURE dbo.EVA_TRX_IsAllFloorsEmpty
    @KejadianId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT CAST(CASE WHEN COUNT(1) = 0 THEN 1 ELSE 0 END AS BIT) AS is_all_empty
    FROM dbo.TRX_EvakuasiLantai
    WHERE kej_id = @KejadianId AND eva_status <> 'Kosong';
END;
GO

/* ---------- 5. ASM_TRX (Assembly Point) ---------- */
IF OBJECT_ID('dbo.ASM_TRX_Scan', 'P') IS NOT NULL DROP PROCEDURE dbo.ASM_TRX_Scan;
GO
CREATE PROCEDURE dbo.ASM_TRX_Scan
    @KejadianId          INT,
    @UserId              INT,
    @KodeAssemblyPoint   VARCHAR(30) = NULL,
    @CreatedBy           VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM dbo.TRX_AbsensiAssembly WHERE kej_id = @KejadianId AND use_id = @UserId)
    BEGIN
        INSERT INTO dbo.TRX_AbsensiAssembly (kej_id, use_id, abs_kode_assembly, abs_waktu_scan, abs_created_by, abs_created_date)
        VALUES (@KejadianId, @UserId, @KodeAssemblyPoint, GETDATE(), @CreatedBy, GETDATE());
    END

    SELECT @@ROWCOUNT AS affected;
END;
GO

IF OBJECT_ID('dbo.ASM_TRX_GetList', 'P') IS NOT NULL DROP PROCEDURE dbo.ASM_TRX_GetList;
GO
CREATE PROCEDURE dbo.ASM_TRX_GetList
    @KejadianId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        a.use_id          AS user_id,
        u.use_nama        AS nama,
        a.abs_waktu_scan  AS waktu_scan
    FROM dbo.TRX_AbsensiAssembly a
    INNER JOIN dbo.MST_User u ON u.use_id = a.use_id
    WHERE a.kej_id = @KejadianId
    ORDER BY a.abs_waktu_scan;
END;
GO

IF OBJECT_ID('dbo.ASM_TRX_GetRekap', 'P') IS NOT NULL DROP PROCEDURE dbo.ASM_TRX_GetRekap;
GO
CREATE PROCEDURE dbo.ASM_TRX_GetRekap
    @KejadianId       INT,
    @TotalTerdaftar   INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @TotalHadir INT = (SELECT COUNT(1) FROM dbo.TRX_AbsensiAssembly WHERE kej_id = @KejadianId);
    DECLARE @WaktuKonfirmasi DATETIME = (SELECT asm_waktu_konfirmasi FROM dbo.TRX_AssemblyKonfirmasi WHERE kej_id = @KejadianId);

    SELECT
        @TotalTerdaftar AS total_terdaftar,
        @TotalHadir AS total_hadir,
        CAST(CASE WHEN @WaktuKonfirmasi IS NULL THEN 0 ELSE 1 END AS BIT) AS sudah_dikonfirmasi,
        @WaktuKonfirmasi AS waktu_konfirmasi;
END;
GO

IF OBJECT_ID('dbo.ASM_TRX_KonfirmasiLengkap', 'P') IS NOT NULL DROP PROCEDURE dbo.ASM_TRX_KonfirmasiLengkap;
GO
CREATE PROCEDURE dbo.ASM_TRX_KonfirmasiLengkap
    @KejadianId  INT,
    @UserId      INT,
    @CreatedBy   VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM dbo.TRX_AssemblyKonfirmasi WHERE kej_id = @KejadianId)
    BEGIN
        INSERT INTO dbo.TRX_AssemblyKonfirmasi (kej_id, use_id_konfirmasi, asm_waktu_konfirmasi, asm_created_by, asm_created_date)
        VALUES (@KejadianId, @UserId, GETDATE(), @CreatedBy, GETDATE());
    END

    SELECT @@ROWCOUNT AS affected;
END;
GO

/* ---------- 6. PER_TRX (P3K / PertolonganPertama) ---------- */
IF OBJECT_ID('dbo.PER_TRX_Get', 'P') IS NOT NULL DROP PROCEDURE dbo.PER_TRX_Get;
GO
CREATE PROCEDURE dbo.PER_TRX_Get
    @KejadianId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        per_ada_korban        AS ada_korban,
        per_jumlah_korban     AS jumlah_korban,
        per_kondisi_korban    AS kondisi_korban,
        per_tindakan          AS tindakan,
        per_perlu_ambulans    AS perlu_ambulans,
        per_waktu_ambulans    AS waktu_panggil_ambulans,
        per_waktu_laporan     AS waktu_laporan
    FROM dbo.TRX_PertolonganPertama
    WHERE kej_id = @KejadianId;
END;
GO

IF OBJECT_ID('dbo.PER_TRX_Upsert', 'P') IS NOT NULL DROP PROCEDURE dbo.PER_TRX_Upsert;
GO
CREATE PROCEDURE dbo.PER_TRX_Upsert
    @KejadianId      INT,
    @AdaKorban       BIT,
    @JumlahKorban    INT = NULL,
    @KondisiKorban   NVARCHAR(300) = NULL,
    @Tindakan        NVARCHAR(500) = NULL,
    @PerluAmbulans   BIT,
    @UserId          INT,
    @CreatedBy       VARCHAR(50),
    @ModifiedBy      VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM dbo.TRX_PertolonganPertama WHERE kej_id = @KejadianId)
    BEGIN
        UPDATE dbo.TRX_PertolonganPertama
        SET per_ada_korban = @AdaKorban,
            per_jumlah_korban = @JumlahKorban,
            per_kondisi_korban = @KondisiKorban,
            per_tindakan = @Tindakan,
            per_perlu_ambulans = @PerluAmbulans,
            per_waktu_ambulans = CASE WHEN @PerluAmbulans = 1 AND per_waktu_ambulans IS NULL THEN GETDATE() ELSE per_waktu_ambulans END,
            use_id_penanganan = @UserId,
            per_waktu_laporan = GETDATE(),
            per_modified_by = @ModifiedBy,
            per_modified_date = GETDATE()
        WHERE kej_id = @KejadianId;
    END
    ELSE
    BEGIN
        INSERT INTO dbo.TRX_PertolonganPertama
            (kej_id, per_ada_korban, per_jumlah_korban, per_kondisi_korban, per_tindakan, per_perlu_ambulans,
             per_waktu_ambulans, use_id_penanganan, per_waktu_laporan, per_created_by, per_created_date)
        VALUES
            (@KejadianId, @AdaKorban, @JumlahKorban, @KondisiKorban, @Tindakan, @PerluAmbulans,
             CASE WHEN @PerluAmbulans = 1 THEN GETDATE() ELSE NULL END, @UserId, GETDATE(), @CreatedBy, GETDATE());
    END

    SELECT @@ROWCOUNT AS affected;
END;
GO

/* ---------- 7. PEM_TRX (Pemadaman) ---------- */
IF OBJECT_ID('dbo.PEM_TRX_Get', 'P') IS NOT NULL DROP PROCEDURE dbo.PEM_TRX_Get;
GO
CREATE PROCEDURE dbo.PEM_TRX_Get
    @KejadianId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        pem_sumber_api        AS sumber_api,
        pem_perlu_damkar      AS perlu_damkar,
        pem_waktu_damkar      AS waktu_panggil_damkar,
        pem_hasil_pemadaman   AS hasil_pemadaman,
        pem_waktu_laporan     AS waktu_laporan
    FROM dbo.TRX_Pemadaman
    WHERE kej_id = @KejadianId;
END;
GO

IF OBJECT_ID('dbo.PEM_TRX_Upsert', 'P') IS NOT NULL DROP PROCEDURE dbo.PEM_TRX_Upsert;
GO
CREATE PROCEDURE dbo.PEM_TRX_Upsert
    @KejadianId      INT,
    @SumberApi       NVARCHAR(200) = NULL,
    @PerluDamkar     BIT,
    @HasilPemadaman  NVARCHAR(500) = NULL,
    @UserId          INT,
    @CreatedBy       VARCHAR(50),
    @ModifiedBy      VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM dbo.TRX_Pemadaman WHERE kej_id = @KejadianId)
    BEGIN
        UPDATE dbo.TRX_Pemadaman
        SET pem_sumber_api = @SumberApi,
            pem_perlu_damkar = @PerluDamkar,
            pem_hasil_pemadaman = @HasilPemadaman,
            pem_waktu_damkar = CASE WHEN @PerluDamkar = 1 AND pem_waktu_damkar IS NULL THEN GETDATE() ELSE pem_waktu_damkar END,
            use_id_penanganan = @UserId,
            pem_waktu_laporan = GETDATE(),
            pem_modified_by = @ModifiedBy,
            pem_modified_date = GETDATE()
        WHERE kej_id = @KejadianId;
    END
    ELSE
    BEGIN
        INSERT INTO dbo.TRX_Pemadaman
            (kej_id, pem_sumber_api, pem_perlu_damkar, pem_waktu_damkar, pem_hasil_pemadaman,
             use_id_penanganan, pem_waktu_laporan, pem_created_by, pem_created_date)
        VALUES
            (@KejadianId, @SumberApi, @PerluDamkar, CASE WHEN @PerluDamkar = 1 THEN GETDATE() ELSE NULL END,
             @HasilPemadaman, @UserId, GETDATE(), @CreatedBy, GETDATE());
    END

    SELECT @@ROWCOUNT AS affected;
END;
GO

/* ---------- 8. KOO_TRX (KoordinasiKondisi) ---------- */
IF OBJECT_ID('dbo.KOO_TRX_GetHistory', 'P') IS NOT NULL DROP PROCEDURE dbo.KOO_TRX_GetHistory;
GO
CREATE PROCEDURE dbo.KOO_TRX_GetHistory
    @KejadianId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        k.koo_catatan       AS catatan,
        u.use_nama          AS diupdate_oleh_nama,
        k.koo_waktu_update  AS waktu_update
    FROM dbo.TRX_KoordinasiKondisi k
    INNER JOIN dbo.MST_User u ON u.use_id = k.use_id_pengupdate
    WHERE k.kej_id = @KejadianId
    ORDER BY k.koo_waktu_update DESC;
END;
GO

IF OBJECT_ID('dbo.KOO_TRX_AddUpdate', 'P') IS NOT NULL DROP PROCEDURE dbo.KOO_TRX_AddUpdate;
GO
CREATE PROCEDURE dbo.KOO_TRX_AddUpdate
    @KejadianId  INT,
    @Catatan     NVARCHAR(500),
    @UserId      INT,
    @CreatedBy   VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.TRX_KoordinasiKondisi (kej_id, koo_catatan, use_id_pengupdate, koo_waktu_update, koo_created_by, koo_created_date)
    VALUES (@KejadianId, @Catatan, @UserId, GETDATE(), @CreatedBy, GETDATE());

    SELECT @@ROWCOUNT AS affected;
END;
GO

/* ---------- 9. LAP_TRX (LaporanKejadian) ---------- */
IF OBJECT_ID('dbo.LAP_TRX_Get', 'P') IS NOT NULL DROP PROCEDURE dbo.LAP_TRX_Get;
GO
CREATE PROCEDURE dbo.LAP_TRX_Get
    @KejadianId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        lap_ringkasan      AS ringkasan,
        lap_tindak_lanjut  AS tindak_lanjut,
        lap_waktu_laporan  AS waktu_laporan
    FROM dbo.TRX_LaporanKejadian
    WHERE kej_id = @KejadianId;
END;
GO

IF OBJECT_ID('dbo.LAP_TRX_Create', 'P') IS NOT NULL DROP PROCEDURE dbo.LAP_TRX_Create;
GO
CREATE PROCEDURE dbo.LAP_TRX_Create
    @KejadianId    INT,
    @Ringkasan     NVARCHAR(2000),
    @TindakLanjut  NVARCHAR(1000) = NULL,
    @UserId        INT,
    @CreatedBy     VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM dbo.TRX_LaporanKejadian WHERE kej_id = @KejadianId)
    BEGIN
        INSERT INTO dbo.TRX_LaporanKejadian
            (kej_id, lap_ringkasan, lap_tindak_lanjut, use_id_pembuat, lap_waktu_laporan, lap_created_by, lap_created_date)
        VALUES
            (@KejadianId, @Ringkasan, @TindakLanjut, @UserId, GETDATE(), @CreatedBy, GETDATE());
    END

    SELECT @@ROWCOUNT AS affected;
END;
GO

IF OBJECT_ID('dbo.LAP_TRX_GetAllReported', 'P') IS NOT NULL DROP PROCEDURE dbo.LAP_TRX_GetAllReported;
GO
CREATE PROCEDURE dbo.LAP_TRX_GetAllReported
    @Halaman  INT = 1,
    @Limit    INT = 20
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Offset INT = (@Halaman - 1) * @Limit;

    SELECT
        k.kej_id                        AS kejadian_id,
        k.kej_kode_kejadian              AS kode_kejadian,
        k.kej_jenis_kejadian             AS jenis_kejadian,
        k.kej_lokasi                     AS lokasi,
        k.kej_deskripsi                  AS deskripsi,
        k.kej_foto_url                   AS foto_url,
        k.kej_status                     AS status,
        k.use_id_pelapor                 AS dilaporkan_oleh_user_id,
        ulapor.use_nama                  AS dilaporkan_oleh_nama,
        k.kej_waktu_lapor                AS waktu_lapor,
        k.use_id_validator               AS divalidasi_oleh_user_id,
        uval.use_nama                    AS divalidasi_oleh_nama,
        k.kej_waktu_validasi             AS waktu_validasi,
        k.kej_hasil_validasi             AS hasil_validasi,
        k.kej_catatan_validasi           AS catatan_validasi,
        k.kej_waktu_pengumuman_darurat   AS waktu_pengumuman_darurat,
        k.kej_waktu_pengumuman_aman      AS waktu_pengumuman_aman,
        k.kej_waktu_ditetapkan_aman      AS waktu_ditetapkan_aman
    FROM dbo.TRX_Kejadian k
    INNER JOIN dbo.MST_User ulapor ON ulapor.use_id = k.use_id_pelapor
    LEFT JOIN dbo.MST_User uval ON uval.use_id = k.use_id_validator
    INNER JOIN dbo.TRX_LaporanKejadian lap ON lap.kej_id = k.kej_id
    ORDER BY lap.lap_waktu_laporan DESC
    OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY;

    SELECT COUNT(1) AS total FROM dbo.TRX_LaporanKejadian;
END;
GO

/* ---------- 10. NOT_TRX (Notifikasi) ---------- */
IF OBJECT_ID('dbo.NOT_TRX_GetAll', 'P') IS NOT NULL DROP PROCEDURE dbo.NOT_TRX_GetAll;
GO
CREATE PROCEDURE dbo.NOT_TRX_GetAll
    @UserId      INT,
    @Halaman     INT = 1,
    @Limit       INT = 20
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Offset INT = (@Halaman - 1) * @Limit;

    SELECT
        not_id            AS notifikasi_id,
        kej_id            AS kejadian_id,
        not_judul         AS judul,
        not_pesan         AS pesan,
        not_tipe          AS tipe,
        not_is_read       AS is_read,
        not_created_date  AS created_at
    FROM dbo.TRX_Notifikasi
    WHERE use_id IS NULL OR use_id = @UserId
    ORDER BY not_created_date DESC
    OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY;

    SELECT COUNT(1) AS total
    FROM dbo.TRX_Notifikasi
    WHERE use_id IS NULL OR use_id = @UserId;
END;
GO

IF OBJECT_ID('dbo.NOT_TRX_GetUnreadCount', 'P') IS NOT NULL DROP PROCEDURE dbo.NOT_TRX_GetUnreadCount;
GO
CREATE PROCEDURE dbo.NOT_TRX_GetUnreadCount
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT COUNT(1) AS total
    FROM dbo.TRX_Notifikasi
    WHERE (use_id IS NULL OR use_id = @UserId) AND not_is_read = 0;
END;
GO

IF OBJECT_ID('dbo.NOT_TRX_MarkRead', 'P') IS NOT NULL DROP PROCEDURE dbo.NOT_TRX_MarkRead;
GO
CREATE PROCEDURE dbo.NOT_TRX_MarkRead
    @Id          INT,
    @UserId      INT,
    @ModifiedBy  VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.TRX_Notifikasi
    SET not_is_read = 1,
        not_modified_by = @ModifiedBy,
        not_modified_date = GETDATE()
    WHERE not_id = @Id AND (use_id IS NULL OR use_id = @UserId);

    SELECT @@ROWCOUNT AS affected;
END;
GO

IF OBJECT_ID('dbo.NOT_TRX_Broadcast', 'P') IS NOT NULL DROP PROCEDURE dbo.NOT_TRX_Broadcast;
GO
CREATE PROCEDURE dbo.NOT_TRX_Broadcast
    @KejadianId  INT = NULL,
    @Judul       NVARCHAR(150),
    @Pesan       NVARCHAR(500),
    @Tipe        VARCHAR(30),
    @CreatedBy   VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.TRX_Notifikasi (use_id, kej_id, not_judul, not_pesan, not_tipe, not_is_read, not_created_by, not_created_date)
    VALUES (NULL, @KejadianId, @Judul, @Pesan, @Tipe, 0, @CreatedBy, GETDATE());

    SELECT @@ROWCOUNT AS affected;
END;
GO

/* ---------- 11. SIM_TRX (Simulasi Tanggap Darurat) ---------- */
IF OBJECT_ID('dbo.SIM_TRX_GetAll', 'P') IS NOT NULL DROP PROCEDURE dbo.SIM_TRX_GetAll;
GO
CREATE PROCEDURE dbo.SIM_TRX_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        sim_id              AS simulasi_id,
        sim_nama            AS nama,
        sim_tanggal         AS tanggal,
        sim_deskripsi       AS deskripsi,
        sim_peserta_count   AS peserta_count,
        sim_evaluasi        AS evaluasi
    FROM dbo.TRX_SimulasiTanggapDarurat
    ORDER BY sim_tanggal DESC;
END;
GO

IF OBJECT_ID('dbo.SIM_TRX_Create', 'P') IS NOT NULL DROP PROCEDURE dbo.SIM_TRX_Create;
GO
CREATE PROCEDURE dbo.SIM_TRX_Create
    @Nama           NVARCHAR(150),
    @Tanggal        DATETIME,
    @Deskripsi      NVARCHAR(1000) = NULL,
    @PesertaCount   INT,
    @Evaluasi       NVARCHAR(1000) = NULL,
    @CreatedBy      VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.TRX_SimulasiTanggapDarurat
        (sim_nama, sim_tanggal, sim_deskripsi, sim_peserta_count, sim_evaluasi, sim_created_by, sim_created_date)
    VALUES
        (@Nama, @Tanggal, @Deskripsi, @PesertaCount, @Evaluasi, @CreatedBy, GETDATE());

    SELECT SCOPE_IDENTITY() AS simulasi_id;
END;
GO

/* ---------- 12. ASE_MST & ASE_TRX (Aset Master & Inspeksi) ---------- */
IF OBJECT_ID('dbo.ASE_MST_GetAll', 'P') IS NOT NULL DROP PROCEDURE dbo.ASE_MST_GetAll;
GO
CREATE PROCEDURE dbo.ASE_MST_GetAll
    @Tipe   VARCHAR(30) = NULL,
    @Status VARCHAR(30) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        ase_id              AS asset_id,
        ase_tipe            AS tipe,
        ase_lokasi          AS lokasi,
        ase_detail          AS detail,
        ase_expired_date    AS expired_date,
        ase_status          AS status,
        ase_last_inspeksi   AS last_inspeksi
    FROM dbo.MST_Aset
    WHERE ase_is_deleted = 0
      AND (@Tipe IS NULL OR ase_tipe = @Tipe)
      AND (@Status IS NULL OR ase_status = @Status)
    ORDER BY ase_id;
END;
GO

IF OBJECT_ID('dbo.ASE_MST_GetById', 'P') IS NOT NULL DROP PROCEDURE dbo.ASE_MST_GetById;
GO
CREATE PROCEDURE dbo.ASE_MST_GetById
    @Id VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        ase_id              AS asset_id,
        ase_tipe            AS tipe,
        ase_lokasi          AS lokasi,
        ase_detail          AS detail,
        ase_expired_date    AS expired_date,
        ase_status          AS status,
        ase_last_inspeksi   AS last_inspeksi
    FROM dbo.MST_Aset
    WHERE ase_id = @Id AND ase_is_deleted = 0;
END;
GO

IF OBJECT_ID('dbo.ASE_MST_Create', 'P') IS NOT NULL DROP PROCEDURE dbo.ASE_MST_Create;
GO
CREATE PROCEDURE dbo.ASE_MST_Create
    @AssetId        VARCHAR(50),
    @Tipe           VARCHAR(30),
    @Lokasi         NVARCHAR(200),
    @Detail         NVARCHAR(500) = NULL,
    @ExpiredDate    DATETIME = NULL,
    @Status         VARCHAR(30) = 'Aman',
    @CreatedBy      VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM dbo.MST_Aset WHERE ase_id = @AssetId)
    BEGIN
        RAISERROR('Kode Aset sudah terdaftar.', 16, 1);
        RETURN;
    END;

    INSERT INTO dbo.MST_Aset
        (ase_id, ase_tipe, ase_lokasi, ase_detail, ase_expired_date, ase_status, ase_last_inspeksi, ase_is_deleted, ase_created_by, ase_created_date)
    VALUES
        (@AssetId, @Tipe, @Lokasi, @Detail, @ExpiredDate, @Status, NULL, 0, @CreatedBy, GETDATE());

    SELECT 1 AS success;
END;
GO

IF OBJECT_ID('dbo.ASE_MST_Update', 'P') IS NOT NULL DROP PROCEDURE dbo.ASE_MST_Update;
GO
CREATE PROCEDURE dbo.ASE_MST_Update
    @AssetId        VARCHAR(50),
    @Tipe           VARCHAR(30) = NULL,
    @Lokasi         NVARCHAR(200),
    @Detail         NVARCHAR(500) = NULL,
    @ExpiredDate    DATETIME = NULL,
    @Status         VARCHAR(30) = 'Aman',
    @ModifiedBy     VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.MST_Aset
    SET ase_lokasi = @Lokasi,
        ase_tipe = ISNULL(@Tipe, ase_tipe),
        ase_detail = @Detail,
        ase_expired_date = @ExpiredDate,
        ase_status = @Status,
        ase_modified_by = @ModifiedBy,
        ase_modified_date = GETDATE()
    WHERE ase_id = @AssetId AND ase_is_deleted = 0;

    SELECT @@ROWCOUNT AS affected;
END;
GO

IF OBJECT_ID('dbo.ASE_MST_Delete', 'P') IS NOT NULL DROP PROCEDURE dbo.ASE_MST_Delete;
GO
CREATE PROCEDURE dbo.ASE_MST_Delete
    @AssetId        VARCHAR(50),
    @DeletedBy      VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.MST_Aset
    SET ase_is_deleted = 1,
        ase_modified_by = @DeletedBy,
        ase_modified_date = GETDATE()
    WHERE ase_id = @AssetId;

    SELECT @@ROWCOUNT AS affected;
END;
GO

IF OBJECT_ID('dbo.ASE_TRX_InspeksiCreate', 'P') IS NOT NULL DROP PROCEDURE dbo.ASE_TRX_InspeksiCreate;
GO
CREATE PROCEDURE dbo.ASE_TRX_InspeksiCreate
    @AsetId         VARCHAR(50),
    @UserIdPetugas  INT,
    @Status         VARCHAR(30),
    @Catatan        NVARCHAR(500) = NULL,
    @FotoUrl        NVARCHAR(300) = NULL,
    @FotoBeforeUrl  NVARCHAR(300) = NULL,
    @FotoAfterUrl   NVARCHAR(300) = NULL,
    @FormData       NVARCHAR(MAX) = NULL,
    @CreatedBy      VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Insert Inspeksi dengan foto before & after
        INSERT INTO dbo.TRX_InspeksiAset
            (ase_id, ins_tanggal, use_id_petugas, ins_status, ins_catatan, ins_foto_url, ins_foto_before_url, ins_foto_after_url, ins_form_data, ins_created_by, ins_created_date)
        VALUES
            (@AsetId, GETDATE(), @UserIdPetugas, @Status, @Catatan, @FotoUrl, @FotoBeforeUrl, @FotoAfterUrl, @FormData, @CreatedBy, GETDATE());

        -- 2. Update Status dan Tanggal Inspeksi Terakhir di Master Aset
        UPDATE dbo.MST_Aset
        SET ase_status = @Status,
            ase_last_inspeksi = GETDATE(),
            ase_modified_by = @CreatedBy,
            ase_modified_date = GETDATE()
        WHERE ase_id = @AsetId;

        COMMIT TRANSACTION;
        SELECT 1 AS success;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO

IF OBJECT_ID('dbo.ASE_TRX_InspeksiGetHistory', 'P') IS NOT NULL DROP PROCEDURE dbo.ASE_TRX_InspeksiGetHistory;
GO
CREATE PROCEDURE dbo.ASE_TRX_InspeksiGetHistory
    @AsetId VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        i.ins_id            AS inspeksi_id,
        i.ase_id            AS asset_id,
        i.ins_tanggal       AS tanggal,
        u.use_nama          AS petugas,
        i.ins_status        AS status,
        i.ins_catatan       AS catatan,
        i.ins_foto_url      AS foto_url,
        i.ins_foto_before_url AS foto_before_url,
        i.ins_foto_after_url  AS foto_after_url,
        i.ins_form_data     AS form_data
    FROM dbo.TRX_InspeksiAset i
    INNER JOIN dbo.MST_User u ON u.use_id = i.use_id_petugas
    WHERE i.ase_id = @AsetId
    ORDER BY i.ins_tanggal DESC;
END;
GO

IF OBJECT_ID('dbo.ASE_TRX_InspeksiGetRecent', 'P') IS NOT NULL DROP PROCEDURE dbo.ASE_TRX_InspeksiGetRecent;
GO
CREATE PROCEDURE dbo.ASE_TRX_InspeksiGetRecent
    @Limit INT = 5
AS
BEGIN
    SET NOCOUNT ON;
    SELECT TOP (@Limit)
        i.ins_id            AS inspeksi_id,
        i.ase_id            AS asset_id,
        i.ins_tanggal       AS tanggal,
        u.use_nama          AS petugas,
        i.ins_status        AS status,
        i.ins_catatan       AS catatan,
        i.ins_foto_url      AS foto_url
    FROM dbo.TRX_InspeksiAset i
    INNER JOIN dbo.MST_User u ON u.use_id = i.use_id_petugas
    ORDER BY i.ins_tanggal DESC;
END;
GO

/* ============================================================
   SELESAI - SETUP DATABASE DB_HSE COMPLETE
   ============================================================ */
PRINT 'Database DB_HSE, seluruh tabel, seed data, dan 49 Stored Procedure berhasil dibuat secara konsolidasi!';
GO
