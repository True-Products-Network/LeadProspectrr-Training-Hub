-- Lessons System for Training Modules
-- Supports gamification, progress tracking, and interactive learning

-- Lessons table - stores individual lessons within modules
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  module_id UUID REFERENCES public.training_modules(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT NOT NULL, -- Markdown/HTML content
  lesson_type TEXT DEFAULT 'standard' CHECK (lesson_type IN ('standard', 'video', 'interactive', 'quiz', 'challenge')),
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 10,
  points INTEGER DEFAULT 10,
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(module_id, lesson_number)
);

-- Lesson progress table - tracks user completion of individual lessons
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  UNIQUE(user_id, lesson_id)
);

-- Daily challenges table - for gamification
CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  challenge_date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('complete_lesson', 'streak', 'share', 'quiz')),
  target_value INTEGER DEFAULT 1,
  bonus_points INTEGER DEFAULT 25,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User daily challenge progress
CREATE TABLE IF NOT EXISTS public.user_daily_challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, challenge_id)
);

-- Study buddies / friends system
CREATE TABLE IF NOT EXISTS public.study_buddies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  buddy_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, buddy_id)
);

-- Mystery badges - hidden achievements
CREATE TABLE IF NOT EXISTS public.mystery_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  badge_key TEXT UNIQUE NOT NULL,
  badge_name TEXT NOT NULL,
  hint TEXT, -- Clue to help users discover it
  description TEXT,
  icon TEXT,
  points INTEGER DEFAULT 50,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  is_hidden BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User mystery badges earned
CREATE TABLE IF NOT EXISTS public.user_mystery_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES public.mystery_badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_buddies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mystery_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mystery_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Lessons - everyone can read published lessons
CREATE POLICY "Everyone can read published lessons" ON public.lessons
  FOR SELECT USING (is_published = true);

-- Admins can manage lessons
CREATE POLICY "Admins can manage lessons" ON public.lessons
  FOR ALL USING (is_admin_user(auth.uid()));

-- Lesson progress - users can read/update their own
CREATE POLICY "Users can read own lesson progress" ON public.lesson_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress" ON public.lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress" ON public.lesson_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Daily challenges - everyone can read active
CREATE POLICY "Everyone can read active challenges" ON public.daily_challenges
  FOR SELECT USING (is_active = true);

-- User daily challenges
CREATE POLICY "Users can read own challenge progress" ON public.user_daily_challenges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own challenge progress" ON public.user_daily_challenges
  FOR ALL USING (auth.uid() = user_id);

-- Study buddies
CREATE POLICY "Users can read own buddy connections" ON public.study_buddies
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = buddy_id);

CREATE POLICY "Users can manage own buddy requests" ON public.study_buddies
  FOR ALL USING (auth.uid() = user_id);

-- Mystery badges
CREATE POLICY "Everyone can read mystery badges" ON public.mystery_badges
  FOR SELECT USING (true);

CREATE POLICY "Users can read own earned mystery badges" ON public.user_mystery_badges
  FOR SELECT USING (auth.uid() = user_id);

-- Function to auto-update module progress when lessons are completed
CREATE OR REPLACE FUNCTION update_module_progress_on_lesson_complete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  module_id UUID;
  total_lessons INTEGER;
  completed_lessons INTEGER;
  user_module_progress_id UUID;
BEGIN
  -- Only process if status changed to completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Get the module_id for this lesson
    SELECT l.module_id INTO module_id
    FROM public.lessons l
    WHERE l.id = NEW.lesson_id;
    
    -- Count total published lessons in module
    SELECT COUNT(*) INTO total_lessons
    FROM public.lessons
    WHERE module_id = module_id AND is_published = true;
    
    -- Count completed lessons for this user in this module
    SELECT COUNT(*) INTO completed_lessons
    FROM public.lesson_progress lp
    JOIN public.lessons l ON l.id = lp.lesson_id
    WHERE l.module_id = module_id 
      AND lp.user_id = NEW.user_id 
      AND lp.status = 'completed'
      AND l.is_published = true;
    
    -- Check if user has module progress record
    SELECT id INTO user_module_progress_id
    FROM public.user_progress
    WHERE user_id = NEW.user_id AND module_id = module_id;
    
    -- If first lesson completed, set module to in_progress
    IF completed_lessons = 1 THEN
      IF user_module_progress_id IS NULL THEN
        INSERT INTO public.user_progress (user_id, module_id, status, started_at)
        VALUES (NEW.user_id, module_id, 'in_progress', NOW());
      ELSE
        UPDATE public.user_progress
        SET status = 'in_progress', started_at = COALESCE(started_at, NOW())
        WHERE id = user_module_progress_id;
      END IF;
    END IF;
    
    -- If all lessons completed, set module to completed
    IF completed_lessons >= total_lessons AND total_lessons > 0 THEN
      UPDATE public.user_progress
      SET status = 'completed', completed_at = NOW()
      WHERE id = user_module_progress_id;
      
      -- Award module completion points
      PERFORM record_user_activity(NEW.user_id, 'module_complete', 
        jsonb_build_object('module_id', module_id, 'points', 50));
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-update module progress
CREATE TRIGGER lesson_progress_completion_trigger
  AFTER INSERT OR UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_module_progress_on_lesson_complete();

-- Function to check and award mystery badges
CREATE OR REPLACE FUNCTION check_mystery_badges(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  badge_record RECORD;
  user_value INTEGER;
BEGIN
  FOR badge_record IN 
    SELECT * FROM public.mystery_badges 
    WHERE is_hidden = true
      AND id NOT IN (
        SELECT badge_id FROM public.user_mystery_badges WHERE user_id = p_user_id
      )
  LOOP
    user_value := 0;
    
    -- Calculate user value based on requirement type
    CASE badge_record.requirement_type
      WHEN 'lessons_completed' THEN
        SELECT COUNT(*) INTO user_value
        FROM public.lesson_progress
        WHERE user_id = p_user_id AND status = 'completed';
      WHEN 'streak_days' THEN
        SELECT current_streak INTO user_value
        FROM public.users
        WHERE id = p_user_id;
      WHEN 'total_points' THEN
        SELECT total_points INTO user_value
        FROM public.users
        WHERE id = p_user_id;
      WHEN 'modules_completed' THEN
        SELECT COUNT(*) INTO user_value
        FROM public.user_progress
        WHERE user_id = p_user_id AND status = 'completed';
    END CASE;
    
    -- Award badge if requirement met
    IF user_value >= badge_record.requirement_value THEN
      INSERT INTO public.user_mystery_badges (user_id, badge_id)
      VALUES (p_user_id, badge_record.id);
      
      -- Add points to user
      UPDATE public.users
      SET total_points = total_points + badge_record.points
      WHERE id = p_user_id;
    END IF;
  END LOOP;
END;
$$;

-- Insert sample mystery badges
INSERT INTO public.mystery_badges (badge_key, badge_name, hint, description, icon, points, requirement_type, requirement_value) VALUES
  ('night_owl', 'Night Owl', 'Study after dark...', 'Complete a lesson between 10 PM and 6 AM', '🦉', 25, 'lessons_completed', 1),
  ('weekend_warrior', 'Weekend Warrior', 'Weekends are for learning too', 'Complete 3 lessons on a weekend', '🏆', 50, 'lessons_completed', 3),
  ('speed_reader', 'Speed Reader', 'Fast learner?', 'Complete a lesson in under 5 minutes', '⚡', 30, 'lessons_completed', 1),
  ('perfectionist', 'Perfectionist', 'Complete everything', 'Complete all lessons in a module with 100% completion', '💎', 100, 'modules_completed', 1),
  ('social_butterfly', 'Social Butterfly', 'Share your progress', 'Share a completed lesson on social media', '🦋', 20, 'lessons_completed', 1)
ON CONFLICT (badge_key) DO NOTHING;

-- Insert sample daily challenges
INSERT INTO public.daily_challenges (challenge_date, title, description, challenge_type, target_value, bonus_points) VALUES
  (CURRENT_DATE, 'First Steps', 'Complete your first lesson today', 'complete_lesson', 1, 25),
  (CURRENT_DATE + 1, 'Double Up', 'Complete 2 lessons today', 'complete_lesson', 2, 50),
  (CURRENT_DATE + 2, 'Streak Keeper', 'Maintain your login streak', 'streak', 1, 30)
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX idx_lessons_module ON public.lessons(module_id);
CREATE INDEX idx_lessons_published ON public.lessons(is_published);
CREATE INDEX idx_lesson_progress_user ON public.lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson ON public.lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_status ON public.lesson_progress(status);
