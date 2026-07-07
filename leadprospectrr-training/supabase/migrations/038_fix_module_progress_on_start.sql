-- Fix module progress to show 'in_progress' when any lesson is started
-- This ensures the training program page shows correct status

DROP TRIGGER IF EXISTS lesson_progress_completion_trigger ON public.lesson_progress;

-- Create improved trigger function that handles both 'in_progress' and 'completed'
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
  -- Get the module_id for this lesson
  SELECT l.module_id INTO v_module_id
  FROM public.lessons l
  WHERE l.id = NEW.lesson_id;
  
  -- Skip if we can't find the lesson
  IF v_module_id IS NULL THEN
    RAISE NOTICE 'Lesson not found: %', NEW.lesson_id;
    RETURN NEW;
  END IF;
  
  -- Check if user has module progress record
  SELECT id INTO v_user_module_progress_id
  FROM public.user_progress
  WHERE user_id = NEW.user_id AND module_id = v_module_id;
  
  -- Handle 'in_progress' status (lesson started)
  IF NEW.status = 'in_progress' THEN
    BEGIN
      IF v_user_module_progress_id IS NULL THEN
        -- Create module progress as in_progress
        INSERT INTO public.user_progress (user_id, module_id, status, started_at)
        VALUES (NEW.user_id, v_module_id, 'in_progress', NOW());
        RAISE NOTICE 'Created module progress as in_progress for user %, module %', NEW.user_id, v_module_id;
      ELSIF v_user_module_progress_id IS NOT NULL THEN
        -- Update existing to in_progress if not already completed
        UPDATE public.user_progress
        SET status = 'in_progress', started_at = COALESCE(started_at, NOW())
        WHERE id = v_user_module_progress_id
        AND status != 'completed';
      END IF;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error handling in_progress: %', SQLERRM;
    END;
  END IF;
  
  -- Handle 'completed' status (lesson completed)
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    BEGIN
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
      
      -- If first lesson completed and no module progress exists, create it
      IF v_completed_lessons = 1 AND v_user_module_progress_id IS NULL THEN
        INSERT INTO public.user_progress (user_id, module_id, status, started_at)
        VALUES (NEW.user_id, v_module_id, 'in_progress', NOW());
        -- Refresh the variable
        SELECT id INTO v_user_module_progress_id
        FROM public.user_progress
        WHERE user_id = NEW.user_id AND module_id = v_module_id;
      END IF;
      
      -- If all lessons completed, set module to completed
      IF v_completed_lessons >= v_total_lessons AND v_total_lessons > 0 THEN
        UPDATE public.user_progress
        SET status = 'completed', completed_at = NOW()
        WHERE id = v_user_module_progress_id;
        
        -- Try to record module completion activity
        BEGIN
          INSERT INTO public.user_activity (user_id, activity_date, activity_type, metadata)
          VALUES (NEW.user_id, CURRENT_DATE, 'module_complete', 
            jsonb_build_object('module_id', v_module_id, 'points', 50))
          ON CONFLICT (user_id, activity_date, activity_type) DO NOTHING;
        EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'Failed to record module completion: %', SQLERRM;
        END;
      END IF;
      
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error handling completed: %', SQLERRM;
    END;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER lesson_progress_completion_trigger
  AFTER INSERT OR UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_module_progress_on_lesson_complete();

-- Enable the trigger
ALTER TABLE public.lesson_progress ENABLE TRIGGER lesson_progress_completion_trigger;

-- Also update existing in_progress lesson_progress records to ensure module progress exists
-- This fixes any existing data issues
DO $$
DECLARE
  v_record RECORD;
  v_module_id UUID;
  v_exists BOOLEAN;
BEGIN
  FOR v_record IN 
    SELECT DISTINCT lp.user_id, l.module_id
    FROM public.lesson_progress lp
    JOIN public.lessons l ON l.id = lp.lesson_id
    WHERE lp.status = 'in_progress'
  LOOP
    -- Check if module progress exists
    SELECT EXISTS(
      SELECT 1 FROM public.user_progress 
      WHERE user_id = v_record.user_id AND module_id = v_record.module_id
    ) INTO v_exists;
    
    -- Create if missing
    IF NOT v_exists THEN
      INSERT INTO public.user_progress (user_id, module_id, status, started_at)
      VALUES (v_record.user_id, v_record.module_id, 'in_progress', NOW())
      ON CONFLICT DO NOTHING;
      RAISE NOTICE 'Created missing module progress for user %, module %', v_record.user_id, v_record.module_id;
    END IF;
  END LOOP;
END $$;
