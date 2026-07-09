-- Check which users are set as admin
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  u.created_at
FROM public.users u
WHERE u.role = 'admin'
ORDER BY u.created_at DESC;
