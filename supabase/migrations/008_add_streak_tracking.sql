-- Streak tracking system for gamification

-- Table to track daily user activity
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('login', 'module_complete', 'resource_download', 'quiz_complete')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_date, activity_type)
);

-- Enable RLS
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Users can read their own activity
CREATE POLICY "Users can read own activity" ON public.user_activity
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own activity
CREATE POLICY "Users can insert own activity" ON public.user_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can read all activity
CREATE POLICY "Admins can read all activity" ON public.user_activity
  FOR SELECT USING (is_admin_user(auth.uid()));

-- Create indexes
CREATE INDEX idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX idx_user_activity_date ON public.user_activity(activity_date);
CREATE INDEX idx_user_activity_user_date ON public.user_activity(user_id, activity_date);

-- Function to calculate current streak
CREATE OR REPLACE FUNCTION calculate_user_streak(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  streak_count INTEGER := 0;
  current_date_check DATE := CURRENT_DATE;
  has_activity BOOLEAN;
BEGIN
  -- Check if user had activity today
  SELECT EXISTS(
    SELECT 1 FROM public.user_activity 
    WHERE user_id = p_user_id 
    AND activity_date = current_date_check
  ) INTO has_activity;
  
  -- If no activity today, check yesterday
  IF NOT has_activity THEN
    current_date_check := CURRENT_DATE - 1;
    SELECT EXISTS(
      SELECT 1 FROM public.user_activity 
      WHERE user_id = p_user_id 
      AND activity_date = current_date_check
    ) INTO has_activity;
    
    -- If no activity yesterday either, streak is 0
    IF NOT has_activity THEN
      RETURN 0;
    END IF;
  END IF;
  
  -- Count consecutive days backwards
  WHILE has_activity LOOP
    streak_count := streak_count + 1;
    current_date_check := current_date_check - 1;
    
    SELECT EXISTS(
      SELECT 1 FROM public.user_activity 
      WHERE user_id = p_user_id 
      AND activity_date = current_date_check
    ) INTO has_activity;
  END LOOP;
  
  RETURN streak_count;
END;
$$;

-- Function to record activity and update streak
CREATE OR REPLACE FUNCTION record_user_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_activity (user_id, activity_date, activity_type, metadata)
  VALUES (p_user_id, CURRENT_DATE, p_activity_type, p_metadata)
  ON CONFLICT (user_id, activity_date, activity_type) DO NOTHING;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION calculate_user_streak(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION record_user_activity(UUID, TEXT, JSONB) TO authenticated;

-- Add streak column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

-- Create achievements/badges table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  badge_key TEXT UNIQUE NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('streak', 'modules', 'downloads', 'points')),
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS on achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Everyone can read achievements
CREATE POLICY "Everyone can read achievements" ON public.achievements
  FOR SELECT USING (true);

-- Users can read their own achievements
CREATE POLICY "Users can read own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- Insert default achievements
INSERT INTO public.achievements (badge_key, badge_name, badge_description, badge_icon, points, requirement_type, requirement_value) VALUES
  ('first_login', 'First Steps', 'Log in for the first time', '🌟', 10, 'streak', 1),
  ('week_warrior', 'Week Warrior', 'Maintain a 7-day streak', '🔥', 50, 'streak', 7),
  ('month_master', 'Month Master', 'Maintain a 30-day streak', '💎', 200, 'streak', 30),
  ('module_rookie', 'Module Rookie', 'Complete your first module', '📚', 25, 'modules', 1),
  ('module_adept', 'Module Adept', 'Complete 5 modules', '🎓', 100, 'modules', 5),
  ('module_master', 'Module Master', 'Complete all modules', '👑', 500, 'modules', 999),
  ('resource_collector', 'Resource Collector', 'Download 10 resources', '📥', 50, 'downloads', 10),
  ('resource_hoarder', 'Resource Hoarder', 'Download 50 resources', '📦', 150, 'downloads', 50),
  ('point_pioneer', 'Point Pioneer', 'Earn 100 points', '⭐', 0, 'points', 100),
  ('point_champion', 'Point Champion', 'Earn 500 points', '🏆', 0, 'points', 500)
ON CONFLICT (badge_key) DO NOTHING;
