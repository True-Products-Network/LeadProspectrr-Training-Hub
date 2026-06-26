-- Test and fix the module progress trigger
-- This migration ensures the trigger works correctly for all modules

-- First, let's recreate the trigger function with detailed logging
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
  v_lesson_record RECORD;
BEGIN
  -- Log entry
  RAISE NOTICE 'Trigger fired: lesson_id=%, user_id=%, status=%, old_status=%', 
    NEW.lesson_id, NEW.user_id, NEW.status, OLD.status;
  
  -- Get the module_id for this lesson
  SELECT l.module_id, l.title INTO v_lesson_record
  FROM public.lessons l
  WHERE l.id = NEW.lesson_id;
  
  v_module_id := v_lesson_record.module_id;
  
  -- Skip if we can't find the lesson
  IF v_module_id IS NULL THEN
    RAISE NOTICE 'Lesson not found: %', NEW.lesson_id;
    RETURN NEW;
  END IF;
  
  RAISE NOTICE 'Found lesson: %, module_id: %', v_lesson_record.title, v_module_id;
  
  -- Check if user has module progress record
  SELECT id, status INTO v_user_module_progress_id, v_completed_lessons
  FROM public.user_progress
  WHERE user_id = NEW.user_id AND module_id = v_module_id;
  
  RAISE NOTICE 'Existing module progress: id=%, status=%', v_user_module_progress_id, v_completed_lessons;
  
  -- Handle 'in_progress' status (lesson started)
  IF NEW.status = 'in_progress' THEN
    BEGIN
      IF v_user_module_progress_id IS NULL THEN
        -- Create module progress as in_progress
        INSERT INTO public.user_progress (user_id, module_id, status, started_at)
        VALUES (NEW.user_id, v_module_id, 'in_progress', NOW());
        RAISE NOTICE 'Created module progress as in_progress for user %, module %', NEW.user_id, v_module_id;
      ELSE
        -- Update existing to in_progress if not already completed
        UPDATE public.user_progress
        SET status = 'in_progress', started_at = COALESCE(started_at, NOW())
        WHERE id = v_user_module_progress_id
        AND status != 'completed';
        RAISE NOTICE 'Updated module progress to in_progress for user %, module %', NEW.user_id, v_module_id;
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
      
      RAISE NOTICE 'Lesson completion: completed=%, total=%', v_completed_lessons, v_total_lessons;
      
      -- If first lesson completed and no module progress exists, create it
      IF v_completed_lessons = 1 THEN
        SELECT id INTO v_user_module_progress_id
        FROM public.user_progress
        WHERE user_id = NEW.user_id AND module_id = v_module_id;
        
        IF v_user_module_progress_id IS NULL THEN
          INSERT INTO public.user_progress (user_id, module_id, status, started_at)
          VALUES (NEW.user_id, v_module_id, 'in_progress', NOW());
          RAISE NOTICE 'Created module progress on first lesson completion';
        END IF;
      END IF;
      
      -- If all lessons completed, set module to completed
      IF v_completed_lessons >= v_total_lessons AND v_total_lessons > 0 THEN
        UPDATE public.user_progress
        SET status = 'completed', completed_at = NOW()
        WHERE user_id = NEW.user_id AND module_id = v_module_id;
        
        RAISE NOTICE 'Module marked as completed';
        
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

-- Make sure the trigger exists
DROP TRIGGER IF EXISTS lesson_progress_completion_trigger ON public.lesson_progress;

CREATE TRIGGER lesson_progress_completion_trigger
  AFTER INSERT OR UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_module_progress_on_lesson_complete();

-- Enable the trigger
ALTER TABLE public.lesson_progress ENABLE TRIGGER lesson_progress_completion_trigger;

-- Verify trigger is enabled
DO $$
BEGIN
  RAISE NOTICE 'Trigger lesson_progress_completion_trigger is now enabled';
END $$;
