-- Fix RLS for analytics tables
-- Ensure admin can read all data for analytics

-- Fix resource_downloads policies
DROP POLICY IF EXISTS "Admins can read all downloads" ON public.resource_downloads;

CREATE POLICY "Admins can read all downloads" ON public.resource_downloads
  FOR SELECT USING (is_admin_user(auth.uid()));

-- Add admin policy for user_progress (module completion stats)
DROP POLICY IF EXISTS "Admins can read all progress" ON public.user_progress;

CREATE POLICY "Admins can read all progress" ON public.user_progress
  FOR SELECT USING (is_admin_user(auth.uid()));

-- Add admin policies for resources table
DROP POLICY IF EXISTS "Admins can read all resources" ON public.resources;
DROP POLICY IF EXISTS "Admins can update all resources" ON public.resources;
DROP POLICY IF EXISTS "Admins can delete all resources" ON public.resources;
DROP POLICY IF EXISTS "Admins can insert resources" ON public.resources;

CREATE POLICY "Admins can read all resources" ON public.resources
  FOR SELECT USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can update all resources" ON public.resources
  FOR UPDATE USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can delete all resources" ON public.resources
  FOR DELETE USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can insert resources" ON public.resources
  FOR INSERT WITH CHECK (is_admin_user(auth.uid()));

-- Add admin policies for training_modules table
DROP POLICY IF EXISTS "Admins can read all modules" ON public.training_modules;
DROP POLICY IF EXISTS "Admins can update all modules" ON public.training_modules;
DROP POLICY IF EXISTS "Admins can delete all modules" ON public.training_modules;
DROP POLICY IF EXISTS "Admins can insert modules" ON public.training_modules;

CREATE POLICY "Admins can read all modules" ON public.training_modules
  FOR SELECT USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can update all modules" ON public.training_modules
  FOR UPDATE USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can delete all modules" ON public.training_modules
  FOR DELETE USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can insert modules" ON public.training_modules
  FOR INSERT WITH CHECK (is_admin_user(auth.uid()));
