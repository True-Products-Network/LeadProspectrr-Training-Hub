-- Fix the trigger function and re-enable it

-- First, drop the existing trigger
DROP TRIGGER IF EXISTS lesson_progress_completion_trigger ON public.lesson_progress;

-- Create or replace the function with fixed variable names
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
    -- Get the module_id for this lesson
    SELECT l.module_id INTO v_module_id
    FROM public.lessons l
    WHERE l.id = NEW.lesson_id;
    
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
      
      -- Award module completion points
      PERFORM record_user_activity(NEW.user_id, 'module_complete', 
        jsonb_build_object('module_id', v_module_id, 'points', 50));
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER lesson_progress_completion_trigger
  AFTER INSERT OR UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_module_progress_on_lesson_complete();

-- Enable the trigger (in case it was disabled)
ALTER TABLE public.lesson_progress ENABLE TRIGGER lesson_progress_completion_trigger;
