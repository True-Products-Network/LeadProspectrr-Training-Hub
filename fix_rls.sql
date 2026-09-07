-- Fix RLS issues identified by Supabase linter
-- Run this in the Supabase SQL Editor

-- Enable RLS on tables that have policies but RLS is disabled
ALTER TABLE public.business_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Fix the SECURITY DEFINER view issue
-- Recreate the view with SECURITY INVOKER instead
DROP VIEW IF EXISTS public.public_approved_listings;

-- Note: You'll need to recreate this view with the correct definition
-- using SECURITY INVOKER (the default) instead of SECURITY DEFINER
-- The view definition should be checked in your migrations or schema

-- Verify RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename IN ('business_categories', 'business_locations', 'profiles');
