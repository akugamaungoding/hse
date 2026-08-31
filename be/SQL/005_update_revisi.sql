USE DB_HSE;
GO

/* ============================================================
   UPDATE DATABASE REVISI HSE TANGGAP DARURAT & MANAJEMEN ASET
   ============================================================ */

-- 1. Tambah Kolom Foto Before & After di TRX_InspeksiAset
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'TRX_InspeksiAset')
BEGIN
    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.TRX_InspeksiAset') AND name = 'ins_foto_before_url')
    BEGIN
        ALTER TABLE dbo.TRX_InspeksiAset ADD ins_foto_before_url NVARCHAR(300) NULL;
    END;

    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.TRX_InspeksiAset') AND name = 'ins_foto_after_url')
    BEGIN
        ALTER TABLE dbo.TRX_InspeksiAset ADD ins_foto_after_url NVARCHAR(300) NULL;
    END;
END;
GO

-- 2. Pastikan 12 Role Terdaftar di MST_Role
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'MST_Role')
BEGIN
    -- Update KEPALA_KTID menjadi KEPALA_TKTD jika ada
    UPDATE dbo.MST_Role SET rol_code = 'KEPALA_TKTD', rol_name = 'Kepala TKTD' WHERE rol_code = 'KEPALA_KTID';

    -- Insert role yang belum ada dari 12 role matrix
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

-- 3. Stored Procedure Update: ASE_TRX_InspeksiCreate
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

-- 4. Stored Procedure Update: ASE_TRX_InspeksiGetHistory
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

PRINT 'Update database DB_HSE revisi berhasil diselesaikan.';
GO
