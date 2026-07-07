-- Fix infinite recursion in users table RLS policies

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.users;

-- Create a security definer function to check admin status
-- This avoids recursion by running with elevated privileges
CREATE OR REPLACE FUNCTION is_admin_user(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_uuid AND role = 'admin'
  );
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_admin_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin_user(UUID) TO anon;

-- Recreate the admin policy using the function
CREATE POLICY "Admins can read all profiles" ON public.users
  FOR SELECT USING (is_admin_user(auth.uid()));

-- Also add an admin update policy
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.users;
CREATE POLICY "Admins can update all profiles" ON public.users
  FOR UPDATE USING (is_admin_user(auth.uid()));

-- Add admin delete policy
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.users;
CREATE POLICY "Admins can delete profiles" ON public.users
  FOR DELETE USING (is_admin_user(auth.uid()));
