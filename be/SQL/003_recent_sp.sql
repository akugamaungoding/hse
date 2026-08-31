USE DB_HSE;
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
