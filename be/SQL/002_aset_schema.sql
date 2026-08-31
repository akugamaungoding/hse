USE DB_HSE;
GO

/* ============================================================
   1. MST_Aset
   ============================================================ */
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

/* ============================================================
   2. TRX_InspeksiAset
   ============================================================ */
IF OBJECT_ID('dbo.TRX_InspeksiAset', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.TRX_InspeksiAset
    (
        ins_id              INT IDENTITY(1,1) NOT NULL,
        ase_id              VARCHAR(50) NOT NULL,
        ins_tanggal         DATETIME NOT NULL DEFAULT GETDATE(),
        use_id_petugas      INT NOT NULL,
        ins_status          VARCHAR(30) NOT NULL,
        ins_catatan         NVARCHAR(500) NULL,
        ins_foto_url        NVARCHAR(300) NULL,
        ins_form_data       NVARCHAR(MAX) NULL, -- Menyimpan Dynamic Parameter Form dalam format JSON
        ins_created_by      VARCHAR(50) NOT NULL,
        ins_created_date    DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT PK_TRX_InspeksiAset PRIMARY KEY (ins_id),
        CONSTRAINT FK_TRX_InspeksiAset_MST_Aset FOREIGN KEY (ase_id) REFERENCES dbo.MST_Aset(ase_id),
        CONSTRAINT FK_TRX_InspeksiAset_MST_User FOREIGN KEY (use_id_petugas) REFERENCES dbo.MST_User(use_id)
    );
END;
GO

/* ============================================================
   3. TRX_SimulasiTanggapDarurat
   ============================================================ */
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
   SEED DATA - MST_Aset
   ============================================================ */
IF NOT EXISTS (SELECT 1 FROM dbo.MST_Aset)
BEGIN
    DECLARE @today DATETIME = GETDATE();

    INSERT INTO dbo.MST_Aset (ase_id, ase_tipe, ase_lokasi, ase_detail, ase_expired_date, ase_status, ase_last_inspeksi, ase_created_by)
    VALUES
    -- APAR
    ('APAR-001', 'APAR', 'Gedung A - Lantai 1', 'Dry Chemical Powder (ABC), 6 Kg', DATEADD(year, 1, @today), 'Aman', DATEADD(day, -5, @today), 'SYSTEM'),
    ('APAR-002', 'APAR', 'Gedung A - Lantai 2', 'CO2, 5 Kg', DATEADD(month, 2, @today), 'Perlu Inspeksi', DATEADD(day, -25, @today), 'SYSTEM'),
    ('APAR-003', 'APAR', 'Gedung A - Lantai 3', 'CO2, 5 Kg', DATEADD(month, -1, @today), 'Rusak', DATEADD(day, -35, @today), 'SYSTEM'),
    ('APAR-004', 'APAR', 'Gedung B - Lantai 1', 'Foam AFFF, 9 L', DATEADD(day, 20, @today), 'Perlu Inspeksi', DATEADD(day, -28, @today), 'SYSTEM'),
    ('APAR-005', 'APAR', 'Gedung B - Lantai 2', 'Dry Chemical Powder, 6 Kg', DATEADD(month, 9, @today), 'Aman', DATEADD(day, -3, @today), 'SYSTEM'),
    -- Hydrant Box
    ('HYD-001', 'HYDRANT_BOX', 'Gedung A - Lobby Utama', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Aman', DATEADD(day, -10, @today), 'SYSTEM'),
    ('HYD-002', 'HYDRANT_BOX', 'Gedung B - Samping Lift', 'Hydrant Box Indoor, Selang 30m, Nozzle 1.5"', NULL, 'Perlu Inspeksi', DATEADD(day, -29, @today), 'SYSTEM'),
    -- Pompa Hydrant
    ('PMP-001', 'POMPA_HYDRANT', 'Rumah Pompa Utama', 'Pompa Hydrant Utama - Diesel Engine, 500 GPM', NULL, 'Aman', DATEADD(day, -7, @today), 'SYSTEM'),
    ('PMP-002', 'POMPA_HYDRANT', 'Rumah Pompa Utama', 'Pompa Jockey Hydrant - Electric Motor, 50 GPM', NULL, 'Aman', DATEADD(day, -7, @today), 'SYSTEM'),
    -- Emergency Box
    ('EMB-001', 'EMERGENCY_BOX', 'Gedung A - Lobby', 'Kotak P3K Tipe B lengkap, Tandu Lipat', NULL, 'Aman', DATEADD(day, -4, @today), 'SYSTEM'),
    ('EMB-002', 'EMERGENCY_BOX', 'Gedung B - Lobby', 'Kotak P3K Tipe B lengkap', NULL, 'Aman', DATEADD(day, -15, @today), 'SYSTEM'),
    -- APD
    ('APD-001', 'APD', 'Gedung A - Pos Satpam', 'Baju Tahan Api, Helm Damkar, Sepatu Safety, Sarung Tangan', NULL, 'Aman', DATEADD(day, -12, @today), 'SYSTEM'),
    ('APD-002', 'APD', 'Gedung B - Control Room', 'Self-Contained Breathing Apparatus (SCBA) 6L', NULL, 'Aman', DATEADD(day, -12, @today), 'SYSTEM');
END;
GO

/* ============================================================
   STORED PROCEDURES - ASE & SIM
   ============================================================ */

/* ---------- ASE_MST (Asset Master) ---------- */
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

/* ---------- ASE_TRX (Asset Inspection Transactions) ---------- */
IF OBJECT_ID('dbo.ASE_TRX_InspeksiCreate', 'P') IS NOT NULL DROP PROCEDURE dbo.ASE_TRX_InspeksiCreate;
GO
CREATE PROCEDURE dbo.ASE_TRX_InspeksiCreate
    @AsetId         VARCHAR(50),
    @UserIdPetugas  INT,
    @Status         VARCHAR(30),
    @Catatan        NVARCHAR(500) = NULL,
    @FotoUrl        NVARCHAR(300) = NULL,
    @FormData       NVARCHAR(MAX) = NULL,
    @CreatedBy      VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Insert Inspeksi
        INSERT INTO dbo.TRX_InspeksiAset
            (ase_id, ins_tanggal, use_id_petugas, ins_status, ins_catatan, ins_foto_url, ins_form_data, ins_created_by, ins_created_date)
        VALUES
            (@AsetId, GETDATE(), @UserIdPetugas, @Status, @Catatan, @FotoUrl, @FormData, @CreatedBy, GETDATE());

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
        i.ins_form_data     AS form_data
    FROM dbo.TRX_InspeksiAset i
    INNER JOIN dbo.MST_User u ON u.use_id = i.use_id_petugas
    WHERE i.ase_id = @AsetId
    ORDER BY i.ins_tanggal DESC;
END;
GO

/* ---------- SIM_TRX (Emergency Response Simulation) ---------- */
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
