-- LeadProspectrr Training Library Database Schema
-- Supports recurring weekly clinics that build up over time

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users from Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Training modules table (supports unlimited weeks)
CREATE TABLE IF NOT EXISTS public.training_modules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  cycle_number INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  color TEXT DEFAULT 'blue',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(week_number, year, cycle_number)
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_training_modules_week ON public.training_modules(week_number);
CREATE INDEX IF NOT EXISTS idx_training_modules_year ON public.training_modules(year);
CREATE INDEX IF NOT EXISTS idx_training_modules_active ON public.training_modules(is_active);

-- Enable RLS on training_modules
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read active training modules
CREATE POLICY "Authenticated users can read training modules" ON public.training_modules
  FOR SELECT USING (is_active = true AND auth.role() = 'authenticated');

-- Only admins can modify training modules
CREATE POLICY "Only admins can modify training modules" ON public.training_modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Resources table (files, guides, templates, etc.)
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  module_id UUID REFERENCES public.training_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'doc', 'video', 'image', 'template', 'cheatsheet', 'guide', 'worksheet', 'checklist')),
  file_url TEXT NOT NULL,
  file_size INTEGER,
  thumbnail_url TEXT,
  download_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on resources
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read published resources
CREATE POLICY "Authenticated users can read published resources" ON public.resources
  FOR SELECT USING (is_published = true AND auth.role() = 'authenticated');

-- Only admins can modify resources
CREATE POLICY "Only admins can modify resources" ON public.resources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- User progress tracking
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.training_modules(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Enable RLS on user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Users can read their own progress
CREATE POLICY "Users can read own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR ALL USING (auth.uid() = user_id);

-- Resource downloads tracking
CREATE TABLE IF NOT EXISTS public.resource_downloads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- Enable RLS on resource_downloads
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Users can read their own downloads
CREATE POLICY "Users can read own downloads" ON public.resource_downloads
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own downloads
CREATE POLICY "Users can insert own downloads" ON public.resource_downloads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for training resources
INSERT INTO storage.buckets (id, name, public)
VALUES ('training-resources', 'training-resources', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for training-resources bucket
CREATE POLICY "Authenticated users can read training resources" ON storage.objects
  FOR SELECT USING (bucket_id = 'training-resources' AND auth.role() = 'authenticated');

CREATE POLICY "Only admins can upload training resources" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'training-resources' AND
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete training resources" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'training-resources' AND
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert initial 6 training modules (Week 1-6)
INSERT INTO public.training_modules (week_number, year, cycle_number, title, description, color) VALUES
  (1, 2026, 1, 'Creating Blog Posts', 'Learn how to create engaging blog content that attracts and converts leads', 'emerald'),
  (2, 2026, 1, 'Contacts and Creating Smart Lists', 'Master contact management and build smart lists for targeted campaigns', 'blue'),
  (3, 2026, 1, 'Email Templates & Campaigns', 'Design professional email templates and automate your campaigns', 'violet'),
  (4, 2026, 1, 'Understanding Conversations Inbox', 'Manage all your customer conversations in one unified inbox', 'amber'),
  (5, 2026, 1, 'Opportunities & Pipelines', 'Track deals and manage your sales pipeline effectively', 'rose'),
  (6, 2026, 1, 'Creating Calendars and Appointment Bookings', 'Set up booking systems and manage appointments seamlessly', 'cyan')
ON CONFLICT (week_number, year, cycle_number) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_modules_updated_at BEFORE UPDATE ON public.training_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get or create current cycle
CREATE OR REPLACE FUNCTION get_current_cycle()
RETURNS INTEGER AS $$
DECLARE
  current_cycle INTEGER;
BEGIN
  SELECT COALESCE(MAX(cycle_number), 1) INTO current_cycle
  FROM public.training_modules
  WHERE year = EXTRACT(YEAR FROM CURRENT_DATE);
  
  RETURN current_cycle;
END;
$$ language 'plpgsql';

-- View to get current active modules
CREATE OR REPLACE VIEW public.current_modules AS
SELECT *
FROM public.training_modules
WHERE is_active = true
  AND year = EXTRACT(YEAR FROM CURRENT_DATE)
ORDER BY week_number;
