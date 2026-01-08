-- Update admin user fullName from Chinese to English
UPDATE users
SET full_name = 'System Administrator'
WHERE username = 'admin' AND is_admin = true;

