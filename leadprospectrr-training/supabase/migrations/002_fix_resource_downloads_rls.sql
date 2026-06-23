-- Fix RLS on resource_downloads table
-- The initial schema accidentally enabled RLS on resources instead of resource_downloads

-- Enable RLS on resource_downloads (if not already enabled)
ALTER TABLE public.resource_downloads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "Users can read own downloads" ON public.resource_downloads;
DROP POLICY IF EXISTS "Users can insert own downloads" ON public.resource_downloads;
DROP POLICY IF EXISTS "Admins can read all downloads" ON public.resource_downloads;

-- Users can read their own downloads
CREATE POLICY "Users can read own downloads" ON public.resource_downloads
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own downloads
CREATE POLICY "Users can insert own downloads" ON public.resource_downloads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can read all downloads (for analytics) - avoid recursion by using a security definer function
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_uuid AND role = 'admin'
  );
$$;

CREATE POLICY "Admins can read all downloads" ON public.resource_downloads
  FOR SELECT USING (is_admin(auth.uid()));
