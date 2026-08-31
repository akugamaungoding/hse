USE DB_HSE;
GO

/* ============================================================
   RESET DAN POPULASI BARU DATA ASET (APAR, HYDRANT, EB, POMPA, APD)
   Semua data lama dihapus dan diganti dengan data inventaris baru.
   ============================================================ */

-- 1. Hapus transaksi inspeksi lama
DELETE FROM dbo.TRX_InspeksiAset;
GO

-- 2. Hapus data aset lama
DELETE FROM dbo.MST_Aset;
GO

-- 3. Populate Data Aset Baru
DECLARE @now DATETIME = GETDATE();

INSERT INTO dbo.MST_Aset
    (ase_id, ase_tipe, ase_lokasi, ase_detail, ase_expired_date, ase_status, ase_last_inspeksi, ase_is_deleted, ase_created_by, ase_created_date)
VALUES
-- ============================================================
-- APAR LANTAI G
-- ============================================================
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

-- ============================================================
-- APAR LANTAI 1
-- ============================================================
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

-- ============================================================
-- APAR LANTAI 2
-- ============================================================
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

-- ============================================================
-- HYDRANT BOX (GEDUNG & DORMITORY & YARD)
-- ============================================================
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

-- ============================================================
-- EMERGENCY BOX
-- ============================================================
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

-- ============================================================
-- POMPA HYDRANT (DUMMY FORMAT FOLLOWING FORMAT)
-- ============================================================
('PMP - RPU - 01', 'POMPA_HYDRANT', 'Rumah Pompa Utama', 'Pompa Hydrant Utama - Diesel Engine, 500 GPM', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
('PMP - RPU - 02', 'POMPA_HYDRANT', 'Rumah Pompa Utama', 'Pompa Electric Utama - Motor Electric, 500 GPM', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
('PMP - RPU - 03', 'POMPA_HYDRANT', 'Rumah Pompa Utama', 'Pompa Jockey Hydrant - Electric Motor, 50 GPM', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
('PMP - RPD - 01', 'POMPA_HYDRANT', 'Rumah Pompa Dormitory', 'Pompa Standby Dormitory - Electric Motor, 250 GPM', NULL, 'Aman', @now, 0, 'SYSTEM', @now),

-- ============================================================
-- APD BOX (DUMMY FORMAT FOLLOWING FORMAT)
-- ============================================================
('APD - CAGF - 01', 'APD', 'Gedung A - Pos Utama Satpam', 'APD Atasan, Celana, Sepatu Safety, Helm Safety (8 Set)', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
('APD - CB1F - 01', 'APD', 'Gedung B - Control Room', 'APD SCBA 6L, Helm Damkar, Baju Tahan Api (8 Set)', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
('APD - CCGF - 01', 'APD', 'Gedung C - Ruang K3 / Klinik', 'APD Atasan, Celana, Sepatu Safety, Helm Safety (8 Set)', NULL, 'Aman', @now, 0, 'SYSTEM', @now),
('APD - DGF - 01', 'APD', 'Gedung Dormitory - Pos Satpam Dormitory', 'APD Fire Fighter Set, Helm Safety (8 Set)', NULL, 'Aman', @now, 0, 'SYSTEM', @now);

GO

PRINT 'Data aset lama berhasil dihapus dan diganti dengan 100% data inventaris baru.';
GO
