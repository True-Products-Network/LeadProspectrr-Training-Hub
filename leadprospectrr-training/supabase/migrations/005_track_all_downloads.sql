-- Modify resource_downloads to track all downloads, not just unique ones
-- Remove the unique constraint and allow multiple downloads

-- First, create a new table that allows multiple downloads
CREATE TABLE IF NOT EXISTS public.resource_downloads_all (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.resource_downloads_all ENABLE ROW LEVEL SECURITY;

-- Users can read their own downloads
CREATE POLICY "Users can read own downloads all" ON public.resource_downloads_all
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own downloads
CREATE POLICY "Users can insert own downloads all" ON public.resource_downloads_all
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can read all downloads
CREATE POLICY "Admins can read all downloads all" ON public.resource_downloads_all
  FOR SELECT USING (is_admin_user(auth.uid()));

-- Grant permissions
GRANT ALL ON public.resource_downloads_all TO authenticated;
GRANT ALL ON public.resource_downloads_all TO anon;

-- Create index for faster queries
CREATE INDEX idx_resource_downloads_all_user ON public.resource_downloads_all(user_id);
CREATE INDEX idx_resource_downloads_all_resource ON public.resource_downloads_all(resource_id);
CREATE INDEX idx_resource_downloads_all_date ON public.resource_downloads_all(downloaded_at);
