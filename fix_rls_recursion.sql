-- Fix RLS infinite recursion on users table
-- First, disable RLS temporarily
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.users;

-- Create non-recursive policies
-- Policy 1: Users can read their own profile
CREATE POLICY "Users can read own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

-- Policy 2: Users can update their own profile  
CREATE POLICY "Users can update own profile" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

-- Policy 3: Allow insert for new users (during signup)
CREATE POLICY "Allow insert for signup" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Now insert the user if not exists
INSERT INTO public.users (id, email, name, role, created_at, updated_at)
VALUES (
  '6556e632-f01f-421e-8e5a-ced45d7f91c2',
  'nigel@trueproductsnetwork.com',
  'Nigel',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE 
SET role = 'admin', updated_at = NOW();
