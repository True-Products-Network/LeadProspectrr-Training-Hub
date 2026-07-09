-- Set a user as admin (replace with the actual email)
-- UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';

-- Or set by user ID:
-- UPDATE public.users SET role = 'admin' WHERE id = 'user-uuid-here';

-- List all users to find the one you want:
SELECT id, email, name, role, created_at 
FROM public.users 
ORDER BY created_at DESC 
LIMIT 20;
