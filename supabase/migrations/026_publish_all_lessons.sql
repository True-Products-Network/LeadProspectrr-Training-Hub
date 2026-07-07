-- Publish all lessons in Module 1

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

  -- Publish all lessons in Module 1
  UPDATE public.lessons 
  SET is_published = true
  WHERE module_id = v_module_id;

  RAISE NOTICE 'Published all lessons in Module 1';
END $$;
