USE DB_HSE;
GO

/* ============================================================
   STORED PROCEDURES FOR ASSET CRUD (CREATE, UPDATE, DELETE)
   ============================================================ */

-- 1. ASE_MST_Create
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

-- 2. ASE_MST_Update
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

-- 3. ASE_MST_Delete
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

PRINT 'Stored procedures CRUD Aset (ASE_MST_Create, ASE_MST_Update, ASE_MST_Delete) berhasil dibuat.';
GO
