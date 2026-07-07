-- Create user_settings table to store user preferences
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN DEFAULT false,
  progress_reminders BOOLEAN DEFAULT false,
  profile_visibility BOOLEAN DEFAULT true,
  activity_status BOOLEAN DEFAULT true,
  dark_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Users can read their own settings
CREATE POLICY "Users can read own settings" ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own settings
CREATE POLICY "Users can update own settings" ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own settings
CREATE POLICY "Users can insert own settings" ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can read all settings
CREATE POLICY "Admins can read all settings" ON public.user_settings
  FOR SELECT USING (is_admin_user(auth.uid()));

-- Create index for faster lookups
CREATE INDEX idx_user_settings_user_id ON public.user_settings(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION update_user_settings_updated_at();
