-- Final fix for lesson progress trigger
-- This ensures module status updates correctly when lessons are started/completed

-- Drop existing trigger
DROP TRIGGER IF EXISTS lesson_progress_completion_trigger ON public.lesson_progress;

-- Create a simple, reliable trigger function
CREATE OR REPLACE FUNCTION update_module_progress_on_lesson_complete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_module_id UUID;
  v_user_module_progress_id UUID;
  v_completed_count INTEGER;
  v_total_lessons INTEGER;
BEGIN
  -- Get module_id for this lesson
  SELECT module_id INTO v_module_id
  FROM public.lessons
  WHERE id = NEW.lesson_id;
  
  IF v_module_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Check for existing module progress
  SELECT id INTO v_user_module_progress_id
  FROM public.user_progress
  WHERE user_id = NEW.user_id AND module_id = v_module_id;
  
  -- Handle in_progress status (lesson started)
  IF NEW.status = 'in_progress' THEN
    IF v_user_module_progress_id IS NULL THEN
      INSERT INTO public.user_progress (user_id, module_id, status, started_at)
      VALUES (NEW.user_id, v_module_id, 'in_progress', NOW());
    ELSIF v_user_module_progress_id IS NOT NULL THEN
      UPDATE public.user_progress
      SET status = 'in_progress', started_at = COALESCE(started_at, NOW())
      WHERE id = v_user_module_progress_id
      AND status = 'not_started';
    END IF;
  END IF;
  
  -- Handle completed status
  IF NEW.status = 'completed' THEN
    -- Count completed lessons
    SELECT COUNT(*) INTO v_completed_count
    FROM public.lesson_progress lp
    JOIN public.lessons l ON l.id = lp.lesson_id
    WHERE l.module_id = v_module_id 
      AND lp.user_id = NEW.user_id 
      AND lp.status = 'completed';
    
    -- Count total lessons
    SELECT COUNT(*) INTO v_total_lessons
    FROM public.lessons
    WHERE module_id = v_module_id AND is_published = true;
    
    -- Create module progress if doesn't exist
    IF v_user_module_progress_id IS NULL THEN
      INSERT INTO public.user_progress (user_id, module_id, status, started_at)
      VALUES (NEW.user_id, v_module_id, 'in_progress', NOW());
      SELECT id INTO v_user_module_progress_id
      FROM public.user_progress
      WHERE user_id = NEW.user_id AND module_id = v_module_id;
    END IF;
    
    -- Mark module completed if all lessons done
    IF v_completed_count >= v_total_lessons AND v_total_lessons > 0 THEN
      UPDATE public.user_progress
      SET status = 'completed', completed_at = NOW()
      WHERE id = v_user_module_progress_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER lesson_progress_completion_trigger
  AFTER INSERT OR UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_module_progress_on_lesson_complete();

-- Enable trigger
ALTER TABLE public.lesson_progress ENABLE TRIGGER lesson_progress_completion_trigger;

-- Fix any existing data - create missing module progress records
DO $$
DECLARE
  v_record RECORD;
BEGIN
  -- For each in-progress lesson without module progress
  FOR v_record IN 
    SELECT DISTINCT lp.user_id, l.module_id
    FROM public.lesson_progress lp
    JOIN public.lessons l ON l.id = lp.lesson_id
    LEFT JOIN public.user_progress up ON up.user_id = lp.user_id AND up.module_id = l.module_id
    WHERE lp.status IN ('in_progress', 'completed')
    AND up.id IS NULL
  LOOP
    INSERT INTO public.user_progress (user_id, module_id, status, started_at)
    VALUES (v_record.user_id, v_record.module_id, 'in_progress', NOW())
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;
