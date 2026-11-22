SET FOREIGN_KEY_CHECKS=0;

TRUNCATE TABLE asset_assignments;
TRUNCATE TABLE assets;
TRUNCATE TABLE employees;
TRUNCATE TABLE vendors;

-- 1. VENDORS
INSERT INTO vendors (id, vendor_code, name, company_name, email, phone, address, is_deleted, created_at, updated_at)
VALUES
(UUID(), 'V-SIG-SIEMENS', 'Rahul Sharma', 'Siemens Mobility India', 'contact@siemens.co.in', '9876543210', 'Navi Mumbai, Maharashtra', 0, NOW(), NOW()),
(UUID(), 'V-DEF-BEL', 'Anita Desai', 'Bharat Electronics Limited', 'sales@bel.co.in', '9876543211', 'Bengaluru, Karnataka', 0, NOW(), NOW()),
(UUID(), 'V-IT-DELL', 'Vikram Singh', 'Dell Technologies India', 'enterprise@dell.co.in', '9876543212', 'Hyderabad, Telangana', 0, NOW(), NOW()),
(UUID(), 'V-NET-CISCO', 'Priya Patel', 'Cisco India', 'networking@cisco.co.in', '9876543213', 'Bengaluru, Karnataka', 0, NOW(), NOW()),
(UUID(), 'V-ELE-KIRL', 'Sanjay Kumar', 'Kirloskar Electric', 'industrial@kirloskar.co.in', '9876543214', 'Pune, Maharashtra', 0, NOW(), NOW());

-- 2. EMPLOYEES
-- 25 total: 20 ACTIVE, 3 ON_LEAVE, 2 INACTIVE
INSERT INTO employees (id, employee_code, name, department, designation, location, status, is_deleted, created_at, updated_at, email)
VALUES
(UUID(), 'EMP-101', 'Rajesh Mohanty', 'IT', 'Senior Section Engineer', 'Bhubaneswar HQ', 'ACTIVE', 0, NOW(), NOW(), 'emp101@railway.com'),
(UUID(), 'EMP-102', 'Suresh Das', 'Signal & Telecom', 'Junior Engineer', 'Bhubaneswar HQ', 'ACTIVE', 0, NOW(), NOW(), 'emp102@railway.com'),
(UUID(), 'EMP-103', 'Arun Patnaik', 'Electrical', 'Technician Grade-I', 'Bhubaneswar HQ', 'ACTIVE', 0, NOW(), NOW(), 'emp103@railway.com'),
(UUID(), 'EMP-104', 'Deepak Singh', 'Operations', 'Section Controller', 'Danapur Division', 'ACTIVE', 0, NOW(), NOW(), 'emp104@railway.com'),
(UUID(), 'EMP-105', 'Manoj Tiwari', 'Mechanical', 'Assistant Loco Pilot', 'Danapur Division', 'ACTIVE', 0, NOW(), NOW(), 'emp105@railway.com'),
(UUID(), 'EMP-106', 'Ramesh Yadav', 'Administration', 'Depot Manager', 'Patna Junction', 'ACTIVE', 0, NOW(), NOW(), 'emp106@railway.com'),
(UUID(), 'EMP-107', 'Sanjay Mishra', 'Electrical', 'Technician Grade-I', 'Patna Junction', 'ACTIVE', 0, NOW(), NOW(), 'emp107@railway.com'),
(UUID(), 'EMP-108', 'Prakash Kumar', 'Signal & Telecom', 'Junior Engineer', 'Gaya Depot', 'ACTIVE', 0, NOW(), NOW(), 'emp108@railway.com'),
(UUID(), 'EMP-109', 'Amit Verma', 'Mechanical', 'Senior Section Engineer', 'Gaya Depot', 'ACTIVE', 0, NOW(), NOW(), 'emp109@railway.com'),
(UUID(), 'EMP-110', 'Sunil Chauhan', 'Operations', 'Assistant Loco Pilot', 'Mughalsarai Workshop', 'ACTIVE', 0, NOW(), NOW(), 'emp110@railway.com'),
(UUID(), 'EMP-111', 'Vijay Pandey', 'IT', 'Technician Grade-I', 'Mughalsarai Workshop', 'ACTIVE', 0, NOW(), NOW(), 'emp111@railway.com'),
(UUID(), 'EMP-112', 'Anil Gupta', 'Administration', 'Section Controller', 'Hajipur', 'ACTIVE', 0, NOW(), NOW(), 'emp112@railway.com'),
(UUID(), 'EMP-113', 'Ashok Reddy', 'Electrical', 'Junior Engineer', 'Hajipur', 'ACTIVE', 0, NOW(), NOW(), 'emp113@railway.com'),
(UUID(), 'EMP-114', 'Subhash Bose', 'Mechanical', 'Depot Manager', 'Bhubaneswar HQ', 'ACTIVE', 0, NOW(), NOW(), 'emp114@railway.com'),
(UUID(), 'EMP-115', 'Naveen Kumar', 'Signal & Telecom', 'Assistant Loco Pilot', 'Danapur Division', 'ACTIVE', 0, NOW(), NOW(), 'emp115@railway.com'),
(UUID(), 'EMP-116', 'Rahul Shankar', 'IT', 'Junior Engineer', 'Patna Junction', 'ACTIVE', 0, NOW(), NOW(), 'emp116@railway.com'),
(UUID(), 'EMP-117', 'Virendra Pratap', 'Operations', 'Section Controller', 'Gaya Depot', 'ACTIVE', 0, NOW(), NOW(), 'emp117@railway.com'),
(UUID(), 'EMP-118', 'Gautam Dasgupta', 'Electrical', 'Senior Section Engineer', 'Mughalsarai Workshop', 'ACTIVE', 0, NOW(), NOW(), 'emp118@railway.com'),
(UUID(), 'EMP-119', 'Yuvraj Narayan', 'Mechanical', 'Technician Grade-I', 'Hajipur', 'ACTIVE', 0, NOW(), NOW(), 'emp119@railway.com'),
(UUID(), 'EMP-120', 'Zaheer Ahmed Khan', 'Administration', 'Depot Manager', 'Bhubaneswar HQ', 'ACTIVE', 0, NOW(), NOW(), 'emp120@railway.com'),
(UUID(), 'EMP-121', 'Harbhajan Singh Gill', 'Signal & Telecom', 'Junior Engineer', 'Danapur Division', 'ON_LEAVE', 0, NOW(), NOW(), 'emp121@railway.com'),
(UUID(), 'EMP-122', 'Anil Kumble Rao', 'Electrical', 'Technician Grade-I', 'Patna Junction', 'ON_LEAVE', 0, NOW(), NOW(), 'emp122@railway.com'),
(UUID(), 'EMP-123', 'VVS Lakshman Reddy', 'IT', 'Senior Section Engineer', 'Gaya Depot', 'ON_LEAVE', 0, NOW(), NOW(), 'emp123@railway.com'),
(UUID(), 'EMP-124', 'Sourav Gangopadhyay', 'Operations', 'Section Controller', 'Mughalsarai Workshop', 'INACTIVE', 0, NOW(), NOW(), 'emp124@railway.com'),
(UUID(), 'EMP-125', 'Sachin Ramesh Tendulkar', 'Mechanical', 'Assistant Loco Pilot', 'Hajipur', 'INACTIVE', 0, NOW(), NOW(), 'emp125@railway.com');

-- 3. ASSETS
-- Get vendor IDs
SET @v_siemens = (SELECT id FROM vendors WHERE vendor_code = 'V-SIG-SIEMENS' LIMIT 1);
SET @v_bel = (SELECT id FROM vendors WHERE vendor_code = 'V-DEF-BEL' LIMIT 1);
SET @v_dell = (SELECT id FROM vendors WHERE vendor_code = 'V-IT-DELL' LIMIT 1);
SET @v_cisco = (SELECT id FROM vendors WHERE vendor_code = 'V-NET-CISCO' LIMIT 1);
SET @v_kirl = (SELECT id FROM vendors WHERE vendor_code = 'V-ELE-KIRL' LIMIT 1);

-- 80 Assets total
-- Status Distribution: AVAILABLE (32), IN_USE (28), UNDER_REPAIR (12), DISPOSED (8)
-- Warranty Distribution: 5 expiring in 10 days, 10 expiring in 25 days, DISPOSED is NULL
INSERT INTO assets (id, name, asset_type, brand, model, serial_number, purchase_date, purchase_cost, status, department, location, warranty_expiry, qr_code, vendor_id, is_deleted, created_at, updated_at)
VALUES
-- IT Equipment (28 items)
(UUID(), 'Dell Latitude Laptop 01', 'IT Equipment', 'Dell', 'Latitude 5420', 'SN-IT-001', '2023-01-10', 75000.00, 'IN_USE', 'IT', 'Bhubaneswar HQ', '2026-01-10', 'AMS-A1B2C301', @v_dell, 0, NOW(), NOW()),
(UUID(), 'Dell Latitude Laptop 02', 'IT Equipment', 'Dell', 'Latitude 5420', 'SN-IT-002', '2023-01-10', 75000.00, 'IN_USE', 'IT', 'Danapur Division', '2026-01-10', 'AMS-A1B2C302', @v_dell, 0, NOW(), NOW()),
(UUID(), 'Dell Latitude Laptop 03', 'IT Equipment', 'Dell', 'Latitude 5420', 'SN-IT-003', '2023-01-10', 75000.00, 'IN_USE', 'IT', 'Patna Junction', '2026-01-10', 'AMS-A1B2C303', @v_dell, 0, NOW(), NOW()),
(UUID(), 'Dell Latitude Laptop 04', 'IT Equipment', 'Dell', 'Latitude 5420', 'SN-IT-004', '2023-01-10', 75000.00, 'IN_USE', 'IT', 'Gaya Depot', '2026-01-10', 'AMS-A1B2C304', @v_dell, 0, NOW(), NOW()),
(UUID(), 'Dell Latitude Laptop 05', 'IT Equipment', 'Dell', 'Latitude 5420', 'SN-IT-005', '2023-01-10', 75000.00, 'IN_USE', 'IT', 'Mughalsarai Workshop', '2026-01-10', 'AMS-A1B2C305', @v_dell, 0, NOW(), NOW()),
(UUID(), 'Dell Latitude Laptop 06', 'IT Equipment', 'Dell', 'Latitude 5420', 'SN-IT-006', '2023-01-10', 75000.00, 'IN_USE', 'IT', 'Hajipur', DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY), 'AMS-A1B2C306', @v_dell, 0, NOW(), NOW()),
(UUID(), 'Dell Latitude Laptop 07', 'IT Equipment', 'Dell', 'Latitude 5420', 'SN-IT-007', '2023-01-10', 75000.00, 'AVAILABLE', 'IT', 'Bhubaneswar HQ', '2026-01-10', 'AMS-A1B2C307', @v_dell, 0, NOW(), NOW()),
(UUID(), 'Dell Latitude Laptop 08', 'IT Equipment', 'Dell', 'Latitude 5420', 'SN-IT-008', '2023-01-10', 75000.00, 'AVAILABLE', 'IT', 'Danapur Division', '2026-01-10', 'AMS-A1B2C308', @v_dell, 0, NOW(), NOW()),
(UUID(), 'Dell Latitude Laptop 09', 'IT Equipment', 'Dell', 'Latitude 5420', 'SN-IT-009', '2023-01-10', 75000.00, 'AVAILABLE', 'IT', 'Patna Junction', '2026-01-10', 'AMS-A1B2C309', @v_dell, 0, NOW(), NOW()),
(UUID(), 'Dell Latitude Laptop 10', 'IT Equipment', 'Dell', 'Latitude 5420', 'SN-IT-010', '2023-01-10', 75000.00, 'UNDER_REPAIR', 'IT', 'Bhubaneswar HQ', DATE_ADD(CURRENT_DATE, INTERVAL 25 DAY), 'AMS-A1B2C310', @v_dell, 0, NOW(), NOW()),
(UUID(), 'Dell Latitude Laptop 11', 'IT Equipment', 'Dell', 'Latitude 5420', 'SN-IT-011', '2023-01-10', 75000.00, 'UNDER_REPAIR', 'IT', 'Bhubaneswar HQ', '2026-01-10', 'AMS-A1B2C311', @v_dell, 0, NOW(), NOW()),
(UUID(), 'Dell Latitude Laptop 12', 'IT Equipment', 'Dell', 'Latitude 5420', 'SN-IT-012', '2023-01-10', 75000.00, 'DISPOSED', 'IT', 'Bhubaneswar HQ', NULL, 'AMS-A1B2C312', @v_dell, 0, NOW(), NOW()),
(UUID(), 'HP Desktop 01', 'IT Equipment', 'HP', 'ProDesk 400', 'SN-IT-013', '2022-05-15', 55000.00, 'IN_USE', 'IT', 'Bhubaneswar HQ', '2027-05-15', 'AMS-A1B2C313', @v_dell, 0, NOW(), NOW()),
(UUID(), 'HP Desktop 02', 'IT Equipment', 'HP', 'ProDesk 400', 'SN-IT-014', '2022-05-15', 55000.00, 'IN_USE', 'IT', 'Danapur Division', DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY), 'AMS-A1B2C314', @v_dell, 0, NOW(), NOW()),
(UUID(), 'HP Desktop 03', 'IT Equipment', 'HP', 'ProDesk 400', 'SN-IT-015', '2022-05-15', 55000.00, 'IN_USE', 'IT', 'Patna Junction', '2027-05-15', 'AMS-A1B2C315', @v_dell, 0, NOW(), NOW()),
(UUID(), 'HP Desktop 04', 'IT Equipment', 'HP', 'ProDesk 400', 'SN-IT-016', '2022-05-15', 55000.00, 'AVAILABLE', 'IT', 'Gaya Depot', '2027-05-15', 'AMS-A1B2C316', @v_dell, 0, NOW(), NOW()),
(UUID(), 'HP Desktop 05', 'IT Equipment', 'HP', 'ProDesk 400', 'SN-IT-017', '2022-05-15', 55000.00, 'AVAILABLE', 'IT', 'Mughalsarai Workshop', DATE_ADD(CURRENT_DATE, INTERVAL 25 DAY), 'AMS-A1B2C317', @v_dell, 0, NOW(), NOW()),
(UUID(), 'HP Desktop 06', 'IT Equipment', 'HP', 'ProDesk 400', 'SN-IT-018', '2022-05-15', 55000.00, 'UNDER_REPAIR', 'IT', 'Hajipur', '2027-05-15', 'AMS-A1B2C318', @v_dell, 0, NOW(), NOW()),
(UUID(), 'HP Desktop 07', 'IT Equipment', 'HP', 'ProDesk 400', 'SN-IT-019', '2022-05-15', 55000.00, 'DISPOSED', 'IT', 'Bhubaneswar HQ', NULL, 'AMS-A1B2C319', @v_dell, 0, NOW(), NOW()),
(UUID(), 'HP Desktop 08', 'IT Equipment', 'HP', 'ProDesk 400', 'SN-IT-020', '2022-05-15', 55000.00, 'AVAILABLE', 'IT', 'Bhubaneswar HQ', '2027-05-15', 'AMS-A1B2C320', @v_dell, 0, NOW(), NOW()),
(UUID(), 'Cisco Catalyst Switch 01', 'IT Equipment', 'Cisco', 'Catalyst 9200', 'SN-IT-021', '2021-11-20', 120000.00, 'IN_USE', 'IT', 'Bhubaneswar HQ', '2026-11-20', 'AMS-A1B2C321', @v_cisco, 0, NOW(), NOW()),
(UUID(), 'Cisco Catalyst Switch 02', 'IT Equipment', 'Cisco', 'Catalyst 9200', 'SN-IT-022', '2021-11-20', 120000.00, 'IN_USE', 'IT', 'Danapur Division', DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY), 'AMS-A1B2C322', @v_cisco, 0, NOW(), NOW()),
(UUID(), 'Cisco Catalyst Switch 03', 'IT Equipment', 'Cisco', 'Catalyst 9200', 'SN-IT-023', '2021-11-20', 120000.00, 'IN_USE', 'IT', 'Patna Junction', '2026-11-20', 'AMS-A1B2C323', @v_cisco, 0, NOW(), NOW()),
(UUID(), 'Cisco Catalyst Switch 04', 'IT Equipment', 'Cisco', 'Catalyst 9200', 'SN-IT-024', '2021-11-20', 120000.00, 'AVAILABLE', 'IT', 'Gaya Depot', '2026-11-20', 'AMS-A1B2C324', @v_cisco, 0, NOW(), NOW()),
(UUID(), 'Cisco Catalyst Switch 05', 'IT Equipment', 'Cisco', 'Catalyst 9200', 'SN-IT-025', '2021-11-20', 120000.00, 'AVAILABLE', 'IT', 'Mughalsarai Workshop', DATE_ADD(CURRENT_DATE, INTERVAL 25 DAY), 'AMS-A1B2C325', @v_cisco, 0, NOW(), NOW()),
(UUID(), 'Cisco Catalyst Switch 06', 'IT Equipment', 'Cisco', 'Catalyst 9200', 'SN-IT-026', '2021-11-20', 120000.00, 'UNDER_REPAIR', 'IT', 'Hajipur', '2026-11-20', 'AMS-A1B2C326', @v_cisco, 0, NOW(), NOW()),
(UUID(), 'Cisco Catalyst Switch 07', 'IT Equipment', 'Cisco', 'Catalyst 9200', 'SN-IT-027', '2021-11-20', 120000.00, 'DISPOSED', 'IT', 'Bhubaneswar HQ', NULL, 'AMS-A1B2C327', @v_cisco, 0, NOW(), NOW()),
(UUID(), 'Cisco Catalyst Switch 08', 'IT Equipment', 'Cisco', 'Catalyst 9200', 'SN-IT-028', '2021-11-20', 120000.00, 'AVAILABLE', 'IT', 'Bhubaneswar HQ', '2026-11-20', 'AMS-A1B2C328', @v_cisco, 0, NOW(), NOW()),
-- Railway Operations Equipment (24 items)
(UUID(), 'Signal Testing Equipment 01', 'Railway Operations Equipment', 'Siemens', 'SigTest-Pro', 'SN-OPS-001', '2020-03-12', 250000.00, 'IN_USE', 'Signal & Telecom', 'Bhubaneswar HQ', '2025-03-12', 'AMS-A1B2C329', @v_siemens, 0, NOW(), NOW()),
(UUID(), 'Signal Testing Equipment 02', 'Railway Operations Equipment', 'Siemens', 'SigTest-Pro', 'SN-OPS-002', '2020-03-12', 250000.00, 'IN_USE', 'Signal & Telecom', 'Danapur Division', DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY), 'AMS-A1B2C330', @v_siemens, 0, NOW(), NOW()),
(UUID(), 'Signal Testing Equipment 03', 'Railway Operations Equipment', 'Siemens', 'SigTest-Pro', 'SN-OPS-003', '2020-03-12', 250000.00, 'IN_USE', 'Signal & Telecom', 'Patna Junction', '2025-03-12', 'AMS-A1B2C331', @v_siemens, 0, NOW(), NOW()),
(UUID(), 'Signal Testing Equipment 04', 'Railway Operations Equipment', 'Siemens', 'SigTest-Pro', 'SN-OPS-004', '2020-03-12', 250000.00, 'AVAILABLE', 'Signal & Telecom', 'Gaya Depot', '2025-03-12', 'AMS-A1B2C332', @v_siemens, 0, NOW(), NOW()),
(UUID(), 'Signal Testing Equipment 05', 'Railway Operations Equipment', 'Siemens', 'SigTest-Pro', 'SN-OPS-005', '2020-03-12', 250000.00, 'AVAILABLE', 'Signal & Telecom', 'Mughalsarai Workshop', DATE_ADD(CURRENT_DATE, INTERVAL 25 DAY), 'AMS-A1B2C333', @v_siemens, 0, NOW(), NOW()),
(UUID(), 'Signal Testing Equipment 06', 'Railway Operations Equipment', 'Siemens', 'SigTest-Pro', 'SN-OPS-006', '2020-03-12', 250000.00, 'UNDER_REPAIR', 'Signal & Telecom', 'Hajipur', '2025-03-12', 'AMS-A1B2C334', @v_siemens, 0, NOW(), NOW()),
(UUID(), 'Signal Testing Equipment 07', 'Railway Operations Equipment', 'Siemens', 'SigTest-Pro', 'SN-OPS-007', '2020-03-12', 250000.00, 'DISPOSED', 'Signal & Telecom', 'Bhubaneswar HQ', NULL, 'AMS-A1B2C335', @v_siemens, 0, NOW(), NOW()),
(UUID(), 'Signal Testing Equipment 08', 'Railway Operations Equipment', 'Siemens', 'SigTest-Pro', 'SN-OPS-008', '2020-03-12', 250000.00, 'AVAILABLE', 'Signal & Telecom', 'Bhubaneswar HQ', '2025-03-12', 'AMS-A1B2C336', @v_siemens, 0, NOW(), NOW()),
(UUID(), 'Signal Testing Equipment 09', 'Railway Operations Equipment', 'Siemens', 'SigTest-Pro', 'SN-OPS-009', '2020-03-12', 250000.00, 'AVAILABLE', 'Signal & Telecom', 'Danapur Division', '2025-03-12', 'AMS-A1B2C337', @v_siemens, 0, NOW(), NOW()),
(UUID(), 'Signal Testing Equipment 10', 'Railway Operations Equipment', 'Siemens', 'SigTest-Pro', 'SN-OPS-010', '2020-03-12', 250000.00, 'AVAILABLE', 'Signal & Telecom', 'Patna Junction', '2025-03-12', 'AMS-A1B2C338', @v_siemens, 0, NOW(), NOW()),
(UUID(), 'Signal Testing Equipment 11', 'Railway Operations Equipment', 'Siemens', 'SigTest-Pro', 'SN-OPS-011', '2020-03-12', 250000.00, 'AVAILABLE', 'Signal & Telecom', 'Gaya Depot', '2025-03-12', 'AMS-A1B2C339', @v_siemens, 0, NOW(), NOW()),
(UUID(), 'Signal Testing Equipment 12', 'Railway Operations Equipment', 'Siemens', 'SigTest-Pro', 'SN-OPS-012', '2020-03-12', 250000.00, 'AVAILABLE', 'Signal & Telecom', 'Mughalsarai Workshop', '2025-03-12', 'AMS-A1B2C340', @v_siemens, 0, NOW(), NOW()),
(UUID(), 'Track Measurement Device 01', 'Railway Operations Equipment', 'BEL', 'TrackScan-500', 'SN-OPS-013', '2021-08-25', 180000.00, 'IN_USE', 'Operations', 'Bhubaneswar HQ', '2026-08-25', 'AMS-A1B2C341', @v_bel, 0, NOW(), NOW()),
(UUID(), 'Track Measurement Device 02', 'Railway Operations Equipment', 'BEL', 'TrackScan-500', 'SN-OPS-014', '2021-08-25', 180000.00, 'IN_USE', 'Operations', 'Danapur Division', '2026-08-25', 'AMS-A1B2C342', @v_bel, 0, NOW(), NOW()),
(UUID(), 'Track Measurement Device 03', 'Railway Operations Equipment', 'BEL', 'TrackScan-500', 'SN-OPS-015', '2021-08-25', 180000.00, 'IN_USE', 'Operations', 'Patna Junction', '2026-08-25', 'AMS-A1B2C343', @v_bel, 0, NOW(), NOW()),
(UUID(), 'Track Measurement Device 04', 'Railway Operations Equipment', 'BEL', 'TrackScan-500', 'SN-OPS-016', '2021-08-25', 180000.00, 'AVAILABLE', 'Operations', 'Gaya Depot', '2026-08-25', 'AMS-A1B2C344', @v_bel, 0, NOW(), NOW()),
(UUID(), 'Track Measurement Device 05', 'Railway Operations Equipment', 'BEL', 'TrackScan-500', 'SN-OPS-017', '2021-08-25', 180000.00, 'AVAILABLE', 'Operations', 'Mughalsarai Workshop', DATE_ADD(CURRENT_DATE, INTERVAL 25 DAY), 'AMS-A1B2C345', @v_bel, 0, NOW(), NOW()),
(UUID(), 'Track Measurement Device 06', 'Railway Operations Equipment', 'BEL', 'TrackScan-500', 'SN-OPS-018', '2021-08-25', 180000.00, 'UNDER_REPAIR', 'Operations', 'Hajipur', '2026-08-25', 'AMS-A1B2C346', @v_bel, 0, NOW(), NOW()),
(UUID(), 'Track Measurement Device 07', 'Railway Operations Equipment', 'BEL', 'TrackScan-500', 'SN-OPS-019', '2021-08-25', 180000.00, 'DISPOSED', 'Operations', 'Bhubaneswar HQ', NULL, 'AMS-A1B2C347', @v_bel, 0, NOW(), NOW()),
(UUID(), 'Track Measurement Device 08', 'Railway Operations Equipment', 'BEL', 'TrackScan-500', 'SN-OPS-020', '2021-08-25', 180000.00, 'AVAILABLE', 'Operations', 'Bhubaneswar HQ', '2026-08-25', 'AMS-A1B2C348', @v_bel, 0, NOW(), NOW()),
(UUID(), 'Track Measurement Device 09', 'Railway Operations Equipment', 'BEL', 'TrackScan-500', 'SN-OPS-021', '2021-08-25', 180000.00, 'AVAILABLE', 'Operations', 'Danapur Division', '2026-08-25', 'AMS-A1B2C349', @v_bel, 0, NOW(), NOW()),
(UUID(), 'Track Measurement Device 10', 'Railway Operations Equipment', 'BEL', 'TrackScan-500', 'SN-OPS-022', '2021-08-25', 180000.00, 'AVAILABLE', 'Operations', 'Patna Junction', '2026-08-25', 'AMS-A1B2C350', @v_bel, 0, NOW(), NOW()),
(UUID(), 'Track Measurement Device 11', 'Railway Operations Equipment', 'BEL', 'TrackScan-500', 'SN-OPS-023', '2021-08-25', 180000.00, 'AVAILABLE', 'Operations', 'Gaya Depot', '2026-08-25', 'AMS-A1B2C351', @v_bel, 0, NOW(), NOW()),
(UUID(), 'Track Measurement Device 12', 'Railway Operations Equipment', 'BEL', 'TrackScan-500', 'SN-OPS-024', '2021-08-25', 180000.00, 'AVAILABLE', 'Operations', 'Mughalsarai Workshop', '2026-08-25', 'AMS-A1B2C352', @v_bel, 0, NOW(), NOW()),
-- Electrical & Maintenance (16 items)
(UUID(), 'Transformer Tester 01', 'Electrical & Maintenance', 'Kirloskar', 'TT-2000', 'SN-ELE-001', '2022-09-10', 320000.00, 'IN_USE', 'Electrical', 'Bhubaneswar HQ', '2027-09-10', 'AMS-A1B2C353', @v_kirl, 0, NOW(), NOW()),
(UUID(), 'Transformer Tester 02', 'Electrical & Maintenance', 'Kirloskar', 'TT-2000', 'SN-ELE-002', '2022-09-10', 320000.00, 'IN_USE', 'Electrical', 'Danapur Division', DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY), 'AMS-A1B2C354', @v_kirl, 0, NOW(), NOW()),
(UUID(), 'Transformer Tester 03', 'Electrical & Maintenance', 'Kirloskar', 'TT-2000', 'SN-ELE-003', '2022-09-10', 320000.00, 'IN_USE', 'Electrical', 'Patna Junction', '2027-09-10', 'AMS-A1B2C355', @v_kirl, 0, NOW(), NOW()),
(UUID(), 'Transformer Tester 04', 'Electrical & Maintenance', 'Kirloskar', 'TT-2000', 'SN-ELE-004', '2022-09-10', 320000.00, 'AVAILABLE', 'Electrical', 'Gaya Depot', '2027-09-10', 'AMS-A1B2C356', @v_kirl, 0, NOW(), NOW()),
(UUID(), 'Transformer Tester 05', 'Electrical & Maintenance', 'Kirloskar', 'TT-2000', 'SN-ELE-005', '2022-09-10', 320000.00, 'AVAILABLE', 'Electrical', 'Mughalsarai Workshop', DATE_ADD(CURRENT_DATE, INTERVAL 25 DAY), 'AMS-A1B2C357', @v_kirl, 0, NOW(), NOW()),
(UUID(), 'Transformer Tester 06', 'Electrical & Maintenance', 'Kirloskar', 'TT-2000', 'SN-ELE-006', '2022-09-10', 320000.00, 'UNDER_REPAIR', 'Electrical', 'Hajipur', '2027-09-10', 'AMS-A1B2C358', @v_kirl, 0, NOW(), NOW()),
(UUID(), 'Transformer Tester 07', 'Electrical & Maintenance', 'Kirloskar', 'TT-2000', 'SN-ELE-007', '2022-09-10', 320000.00, 'DISPOSED', 'Electrical', 'Bhubaneswar HQ', NULL, 'AMS-A1B2C359', @v_kirl, 0, NOW(), NOW()),
(UUID(), 'Transformer Tester 08', 'Electrical & Maintenance', 'Kirloskar', 'TT-2000', 'SN-ELE-008', '2022-09-10', 320000.00, 'AVAILABLE', 'Electrical', 'Bhubaneswar HQ', '2027-09-10', 'AMS-A1B2C360', @v_kirl, 0, NOW(), NOW()),
(UUID(), 'Battery Charger 01', 'Electrical & Maintenance', 'Kirloskar', 'BC-HighCap', 'SN-ELE-009', '2023-02-18', 45000.00, 'IN_USE', 'Electrical', 'Danapur Division', '2028-02-18', 'AMS-A1B2C361', @v_kirl, 0, NOW(), NOW()),
(UUID(), 'Battery Charger 02', 'Electrical & Maintenance', 'Kirloskar', 'BC-HighCap', 'SN-ELE-010', '2023-02-18', 45000.00, 'IN_USE', 'Electrical', 'Patna Junction', '2028-02-18', 'AMS-A1B2C362', @v_kirl, 0, NOW(), NOW()),
(UUID(), 'Battery Charger 03', 'Electrical & Maintenance', 'Kirloskar', 'BC-HighCap', 'SN-ELE-011', '2023-02-18', 45000.00, 'IN_USE', 'Electrical', 'Gaya Depot', '2028-02-18', 'AMS-A1B2C363', @v_kirl, 0, NOW(), NOW()),
(UUID(), 'Battery Charger 04', 'Electrical & Maintenance', 'Kirloskar', 'BC-HighCap', 'SN-ELE-012', '2023-02-18', 45000.00, 'AVAILABLE', 'Electrical', 'Mughalsarai Workshop', '2028-02-18', 'AMS-A1B2C364', @v_kirl, 0, NOW(), NOW()),
(UUID(), 'Battery Charger 05', 'Electrical & Maintenance', 'Kirloskar', 'BC-HighCap', 'SN-ELE-013', '2023-02-18', 45000.00, 'AVAILABLE', 'Electrical', 'Hajipur', DATE_ADD(CURRENT_DATE, INTERVAL 25 DAY), 'AMS-A1B2C365', @v_kirl, 0, NOW(), NOW()),
(UUID(), 'Battery Charger 06', 'Electrical & Maintenance', 'Kirloskar', 'BC-HighCap', 'SN-ELE-014', '2023-02-18', 45000.00, 'UNDER_REPAIR', 'Electrical', 'Bhubaneswar HQ', '2028-02-18', 'AMS-A1B2C366', @v_kirl, 0, NOW(), NOW()),
(UUID(), 'Battery Charger 07', 'Electrical & Maintenance', 'Kirloskar', 'BC-HighCap', 'SN-ELE-015', '2023-02-18', 45000.00, 'DISPOSED', 'Electrical', 'Bhubaneswar HQ', NULL, 'AMS-A1B2C367', @v_kirl, 0, NOW(), NOW()),
(UUID(), 'Battery Charger 08', 'Electrical & Maintenance', 'Kirloskar', 'BC-HighCap', 'SN-ELE-016', '2023-02-18', 45000.00, 'AVAILABLE', 'Electrical', 'Danapur Division', '2028-02-18', 'AMS-A1B2C368', @v_kirl, 0, NOW(), NOW()),
-- Office Equipment (8 items)
(UUID(), 'Office Printer 01', 'Office Equipment', 'HP', 'LaserJet Pro', 'SN-OFF-001', '2021-12-05', 25000.00, 'IN_USE', 'Administration', 'Bhubaneswar HQ', '2026-12-05', 'AMS-A1B2C369', @v_dell, 0, NOW(), NOW()),
(UUID(), 'Office Printer 02', 'Office Equipment', 'HP', 'LaserJet Pro', 'SN-OFF-002', '2021-12-05', 25000.00, 'IN_USE', 'Administration', 'Danapur Division', '2026-12-05', 'AMS-A1B2C370', @v_dell, 0, NOW(), NOW()),
(UUID(), 'Office Printer 03', 'Office Equipment', 'HP', 'LaserJet Pro', 'SN-OFF-003', '2021-12-05', 25000.00, 'AVAILABLE', 'Administration', 'Patna Junction', DATE_ADD(CURRENT_DATE, INTERVAL 25 DAY), 'AMS-A1B2C371', @v_dell, 0, NOW(), NOW()),
(UUID(), 'Office Printer 04', 'Office Equipment', 'HP', 'LaserJet Pro', 'SN-OFF-004', '2021-12-05', 25000.00, 'AVAILABLE', 'Administration', 'Gaya Depot', '2026-12-05', 'AMS-A1B2C372', @v_dell, 0, NOW(), NOW()),
(UUID(), 'Office Printer 05', 'Office Equipment', 'HP', 'LaserJet Pro', 'SN-OFF-005', '2021-12-05', 25000.00, 'AVAILABLE', 'Administration', 'Mughalsarai Workshop', '2026-12-05', 'AMS-A1B2C373', @v_dell, 0, NOW(), NOW()),
(UUID(), 'Office Printer 06', 'Office Equipment', 'HP', 'LaserJet Pro', 'SN-OFF-006', '2021-12-05', 25000.00, 'UNDER_REPAIR', 'Administration', 'Hajipur', '2026-12-05', 'AMS-A1B2C374', @v_dell, 0, NOW(), NOW()),
(UUID(), 'Office Printer 07', 'Office Equipment', 'HP', 'LaserJet Pro', 'SN-OFF-007', '2021-12-05', 25000.00, 'DISPOSED', 'Administration', 'Bhubaneswar HQ', NULL, 'AMS-A1B2C375', @v_dell, 0, NOW(), NOW()),
(UUID(), 'Office Printer 08', 'Office Equipment', 'HP', 'LaserJet Pro', 'SN-OFF-008', '2021-12-05', 25000.00, 'UNDER_REPAIR', 'Administration', 'Bhubaneswar HQ', DATE_ADD(CURRENT_DATE, INTERVAL 25 DAY), 'AMS-A1B2C376', @v_dell, 0, NOW(), NOW()),
-- Vehicles (4 items)
(UUID(), 'Inspection Vehicle 01', 'Vehicles', 'Tata', 'Sumo Gold', 'SN-VEH-001', '2019-06-20', 850000.00, 'IN_USE', 'Mechanical', 'Bhubaneswar HQ', '2029-06-20', 'AMS-A1B2C377', @v_kirl, 0, NOW(), NOW()),
(UUID(), 'Inspection Vehicle 02', 'Vehicles', 'Tata', 'Sumo Gold', 'SN-VEH-002', '2019-06-20', 850000.00, 'IN_USE', 'Mechanical', 'Danapur Division', DATE_ADD(CURRENT_DATE, INTERVAL 25 DAY), 'AMS-A1B2C378', @v_kirl, 0, NOW(), NOW()),
(UUID(), 'Inspection Vehicle 03', 'Vehicles', 'Tata', 'Sumo Gold', 'SN-VEH-003', '2019-06-20', 850000.00, 'UNDER_REPAIR', 'Mechanical', 'Patna Junction', '2029-06-20', 'AMS-A1B2C379', @v_kirl, 0, NOW(), NOW()),
(UUID(), 'Inspection Vehicle 04', 'Vehicles', 'Tata', 'Sumo Gold', 'SN-VEH-004', '2019-06-20', 850000.00, 'UNDER_REPAIR', 'Mechanical', 'Gaya Depot', '2029-06-20', 'AMS-A1B2C380', @v_kirl, 0, NOW(), NOW());

-- 4. ASSET_ASSIGNMENTS (28 active assignments for IN_USE assets)
INSERT INTO asset_assignments (id, asset_id, employee_id, assigned_date, returned_date, status)
SELECT
    UUID(),
    a.id,
    e.id,
    '2023-06-01',
    NULL,
    'ACTIVE'
FROM assets a
INNER JOIN employees e ON e.status = 'ACTIVE'
WHERE a.status = 'IN_USE'
ORDER BY RAND()
LIMIT 28;

-- Post-Seeding Warranty Date Correction
UPDATE assets SET warranty_expiry = DATE_ADD(CURRENT_DATE, INTERVAL 45 DAY) WHERE warranty_expiry = '2026-01-10';
UPDATE assets SET warranty_expiry = DATE_ADD(CURRENT_DATE, INTERVAL 60 DAY) WHERE warranty_expiry = '2025-03-12';
UPDATE assets SET warranty_expiry = DATE_ADD(CURRENT_DATE, INTERVAL 59 DAY) WHERE warranty_expiry = '2026-08-25';
UPDATE assets SET warranty_expiry = DATE_ADD(CURRENT_DATE, INTERVAL 120 DAY) WHERE warranty_expiry = '2026-11-20';


-- VERIFICATION COUNTS
SELECT COUNT(*) AS total_vendors FROM vendors;
SELECT COUNT(*) AS total_employees FROM employees;
SELECT COUNT(*) AS total_assets FROM assets;
SELECT COUNT(*) AS total_assignments FROM asset_assignments;

SET FOREIGN_KEY_CHECKS=1;
