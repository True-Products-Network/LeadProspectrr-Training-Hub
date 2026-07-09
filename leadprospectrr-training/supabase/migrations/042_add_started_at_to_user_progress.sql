-- Add started_at column to user_progress table
ALTER TABLE public.user_progress 
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE;
