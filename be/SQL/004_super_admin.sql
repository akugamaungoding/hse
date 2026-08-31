USE DB_HSE;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.MST_Role WHERE rol_code = 'SUPER_ADMIN')
BEGIN
    INSERT INTO dbo.MST_Role (rol_code, rol_name, rol_status, rol_is_deleted, rol_created_by, rol_created_date)
    VALUES ('SUPER_ADMIN', 'Super Administrator', 'Aktif', 0, 'SYSTEM', GETDATE());
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.MST_User WHERE use_username = 'superadmin')
BEGIN
    DECLARE @rolId INT;
    SELECT @rolId = rol_id FROM dbo.MST_Role WHERE rol_code = 'SUPER_ADMIN';

    INSERT INTO dbo.MST_User (use_username, use_password_hash, use_nama, use_email, use_no_hp, use_status, use_is_deleted, rol_id, use_created_by, use_created_date)
    VALUES ('superadmin', 'superadmin', 'Super Administrator', 'superadmin@polytechnic.astra.ac.id', '081234567890', 'Aktif', 0, @rolId, 'SYSTEM', GETDATE());
END
GO
