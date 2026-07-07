-- Fix lesson sort_order and ensure all lessons are published

DO $$
DECLARE
  v_module_id UUID;
BEGIN
  -- Get Module 1
  SELECT id INTO v_module_id FROM public.training_modules WHERE week_number = 1 LIMIT 1;
  
  IF v_module_id IS NULL THEN
    RAISE NOTICE 'Module 1 not found';
    RETURN;
  END IF;

  -- Update sort_order to match lesson_number for proper ordering
  UPDATE public.lessons 
  SET sort_order = lesson_number
  WHERE module_id = v_module_id;

  -- Ensure all lessons are published
  UPDATE public.lessons 
  SET is_published = true
  WHERE module_id = v_module_id;

  RAISE NOTICE 'Updated all lessons in Module 1: set sort_order = lesson_number and is_published = true';
END $$;
