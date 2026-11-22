USE ams_db;


-- Link Assets to Vendors
UPDATE assets SET vendor_id = 'v_001' WHERE id = '0e1c936d-347a-452e-8c44-b7dd9dc9c486';
UPDATE assets SET vendor_id = 'v_002' WHERE id = '0f342085-55a1-4a4e-b53e-3e372cf759eb';
UPDATE assets SET vendor_id = 'v_003' WHERE id = '146f99e6-4830-4721-8827-833d5f186717';
UPDATE assets SET vendor_id = 'v_001' WHERE id = '19f5d2d5-cea6-45e6-ace5-a5f5ef5bfd2d';
UPDATE assets SET vendor_id = 'v_002' WHERE id = '20ad5d33-0aaa-4e46-9784-2227657f7b2d';

-- Update Asset Status for those going under maintenance
UPDATE assets SET status = 'UNDER_REPAIR' WHERE id IN ('0e1c936d-347a-452e-8c44-b7dd9dc9c486', '0f342085-55a1-4a4e-b53e-3e372cf759eb');

-- Insert Maintenance Tickets
INSERT INTO maintenance_tickets (id, asset_id, issue_description, reported_date, priority, status, technician, vendor_id, repair_cost, completed_date, remarks, created_at, updated_at, is_deleted)
VALUES
('m_001', '0e1c936d-347a-452e-8c44-b7dd9dc9c486', 'Engine stalling occasionally during track inspection.', DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'HIGH', 'IN_PROGRESS', 'Ravi Kumar', 'v_001', NULL, NULL, NULL, NOW(), NOW(), false),

('m_002', '0f342085-55a1-4a4e-b53e-3e372cf759eb', 'Flickering display after 2 hours of usage.', CURDATE(), 'MEDIUM', 'OPEN', 'Anita Desai', 'v_002', NULL, NULL, NULL, NOW(), NOW(), false),

('m_003', '146f99e6-4830-4721-8827-833d5f186717', 'Lens calibration required.', DATE_SUB(CURDATE(), INTERVAL 15 DAY), 'LOW', 'COMPLETED', 'Sunil Joshi', 'v_003', 1500.00, DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'Recalibrated and cleaned lens.', NOW(), NOW(), false);
