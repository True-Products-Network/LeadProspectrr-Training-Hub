-- Simplify the lesson progress trigger to avoid errors
-- Drop the existing trigger first
DROP TRIGGER IF EXISTS lesson_progress_completion_trigger ON public.lesson_progress;

-- Create a simplified trigger function that handles errors gracefully
CREATE OR REPLACE FUNCTION update_module_progress_on_lesson_complete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_module_id UUID;
  v_total_lessons INTEGER;
  v_completed_lessons INTEGER;
  v_user_module_progress_id UUID;
BEGIN
  -- Only process if status changed to completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    BEGIN
      -- Get the module_id for this lesson
      SELECT l.module_id INTO v_module_id
      FROM public.lessons l
      WHERE l.id = NEW.lesson_id;
      
      -- Skip if we can't find the lesson
      IF v_module_id IS NULL THEN
        RAISE NOTICE 'Lesson not found: %', NEW.lesson_id;
        RETURN NEW;
      END IF;
      
      -- Count total published lessons in module
      SELECT COUNT(*) INTO v_total_lessons
      FROM public.lessons
      WHERE module_id = v_module_id AND is_published = true;
      
      -- Count completed lessons for this user in this module
      SELECT COUNT(*) INTO v_completed_lessons
      FROM public.lesson_progress lp
      JOIN public.lessons l ON l.id = lp.lesson_id
      WHERE l.module_id = v_module_id 
        AND lp.user_id = NEW.user_id 
        AND lp.status = 'completed'
        AND l.is_published = true;
      
      -- Check if user has module progress record
      SELECT id INTO v_user_module_progress_id
      FROM public.user_progress
      WHERE user_id = NEW.user_id AND module_id = v_module_id;
      
      -- If first lesson completed, set module to in_progress
      IF v_completed_lessons = 1 THEN
        IF v_user_module_progress_id IS NULL THEN
          INSERT INTO public.user_progress (user_id, module_id, status, started_at)
          VALUES (NEW.user_id, v_module_id, 'in_progress', NOW());
        ELSE
          UPDATE public.user_progress
          SET status = 'in_progress', started_at = COALESCE(started_at, NOW())
          WHERE id = v_user_module_progress_id;
        END IF;
      END IF;
      
      -- If all lessons completed, set module to completed
      IF v_completed_lessons >= v_total_lessons AND v_total_lessons > 0 THEN
        UPDATE public.user_progress
        SET status = 'completed', completed_at = NOW()
        WHERE id = v_user_module_progress_id;
        
        -- Try to record module completion activity, but don't fail if it doesn't work
        BEGIN
          INSERT INTO public.user_activity (user_id, activity_date, activity_type, metadata)
          VALUES (NEW.user_id, CURRENT_DATE, 'module_complete', 
            jsonb_build_object('module_id', v_module_id, 'points', 50))
          ON CONFLICT (user_id, activity_date, activity_type) DO NOTHING;
        EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'Failed to record module completion activity: %', SQLERRM;
        END;
      END IF;
      
    EXCEPTION WHEN OTHERS THEN
      -- Log the error but don't fail the transaction
      RAISE NOTICE 'Error in update_module_progress_on_lesson_complete: %', SQLERRM;
    END;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER lesson_progress_completion_trigger
  AFTER INSERT OR UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_module_progress_on_lesson_complete();

-- Enable the trigger
ALTER TABLE public.lesson_progress ENABLE TRIGGER lesson_progress_completion_trigger;

-- Also ensure the check_mystery_badges function exists and handles errors
CREATE OR REPLACE FUNCTION check_mystery_badges(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  badge_record RECORD;
  user_value INTEGER;
BEGIN
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
        BEGIN
          INSERT INTO public.user_mystery_badges (user_id, badge_id)
          VALUES (p_user_id, badge_record.id);
          
          -- Add points to user
          UPDATE public.users
          SET total_points = total_points + badge_record.points
          WHERE id = p_user_id;
        EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'Failed to award badge: %', SQLERRM;
        END;
      END IF;
    END LOOP;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error in check_mystery_badges: %', SQLERRM;
  END;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION check_mystery_badges(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION check_mystery_badges(UUID) TO service_role;
